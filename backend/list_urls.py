import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.urls import get_resolver

print("=== URLs chargées par Django ===\n")

resolver = get_resolver()

def show_urls(urlpatterns, prefix=''):
    for pattern in urlpatterns:
        if hasattr(pattern, 'url_patterns'):
            # C'est un include()
            show_urls(pattern.url_patterns, prefix + str(pattern.pattern))
        else:
            # C'est une URL simple
            full_url = prefix + str(pattern.pattern)
            name = pattern.name if hasattr(pattern, 'name') else 'no-name'
            print(f"{full_url:<60} [{name}]")

show_urls(resolver.url_patterns)

print("\n=== Recherche de 'change-password' ===")
for pattern in resolver.url_patterns:
    if hasattr(pattern, 'url_patterns'):
        for sub_pattern in pattern.url_patterns:
            pattern_str = str(sub_pattern.pattern)
            if 'change' in pattern_str or 'password' in pattern_str:
                print(f"Trouvé: {pattern.pattern}{pattern_str}")
