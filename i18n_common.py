#!/usr/bin/env python3
"""Shared helpers for v4.63 i18n translation.
Uses raw HTTP because the proxy returns rate-limit as HTTP 200 with an
{"error":"Rate limit exceeded"} body, which the OpenAI SDK mishandles.
We detect that body and back off. Global throttle keeps us under 200/min.
"""
import os, json, time, threading, requests

BASE = os.environ["OPENAI_API_BASE"].rstrip("/")
KEY = os.environ["OPENAI_API_KEY"]
MODEL = "gpt-5-mini"

_lock = threading.Lock()
_last = [0.0]
_MIN_INTERVAL = 0.34  # ~176 req/min ceiling across all threads

def _throttle():
    with _lock:
        now = time.time()
        wait = _MIN_INTERVAL - (now - _last[0])
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.time()

def chat_json(system, user, schema, max_retries=8):
    """Call the proxy expecting strict JSON schema output. Returns parsed dict or None."""
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "response_format": {
            "type": "json_schema",
            "json_schema": {"name": "out", "strict": True, "schema": schema},
        },
    }
    headers = {"Authorization": "Bearer " + KEY, "Content-Type": "application/json"}
    delay = 5.0
    for attempt in range(max_retries):
        _throttle()
        try:
            r = requests.post(BASE + "/chat/completions", headers=headers, json=body, timeout=120)
        except Exception:
            time.sleep(min(delay, 30)); delay *= 1.6; continue
        # rate limit body (may be HTTP 200 or 429)
        txt = r.text
        if '"Rate limit exceeded"' in txt or r.status_code == 429:
            time.sleep(min(delay, 30)); delay *= 1.6; continue
        if r.status_code != 200:
            time.sleep(min(delay, 20)); delay *= 1.5; continue
        try:
            data = r.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)
        except Exception:
            time.sleep(min(delay, 15)); delay *= 1.4; continue
    return None
