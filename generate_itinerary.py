import sys
import json
import re
import random

if __name__ == '__main__':
    prompt = sys.argv[1] if len(sys.argv) > 1 else ""
    days = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else 1
    all_places_json = sys.argv[3] if len(sys.argv) > 3 else "[]"
    try:
        all_places = json.loads(all_places_json)
    except json.JSONDecodeError:
        all_places = []

    keywords = prompt.lower()

    pool = []
    if 'cheap' in keywords or 'budget' in keywords:
        pool = [
            p for p in all_places
            if p.get('priceLabel') and (
                re.search(r'₹(\d+)', p['priceLabel']) and
                int(re.search(r'₹(\d+)', p['priceLabel']).group(1)) <= 3500
            )
        ]
    elif 'monastery' in keywords:
        pool = [p for p in all_places if p['type'] == 'monastery' or p['type'] == 'place']
    else:
        pool = all_places

    list_ = pool if pool else all_places
    random.shuffle(list_)  # Shuffle to avoid repetitive selections
    days_arr = []
    for d in range(max(1, days)):
        start = (d * 3) % len(list_) if list_ else 0
        picks = [list_[i % len(list_)] for i in range(start, start + 3)] if list_ else []
        days_arr.append({
            'id': f'day-{d + 1}',
            'title': f'Day {d + 1}',
            'items': [p['id'] for p in picks if p]
        })

    print(json.dumps(days_arr))