from ..models import Feed

def get_balanced_feeds(species, age_group, session_number):
    feeds = Feed.objects.filter(
        species__iexact=species,
        age_group__iexact=age_group,
        is_active=True
    )

    if not feeds.exists():
        return list(Feed.objects.filter(is_active=True)[:2])

    primary = feeds.filter(role="primary")
    booster = feeds.filter(role="booster")
    supplement = feeds.filter(role="supplement")
    energy = feeds.filter(role="energy")

    selected_feeds = []

    if primary.exists():
        selected_feeds.append(primary.first())
    else:
        selected_feeds.append(feeds.first())

    if session_number == 1:
        if booster.exists():
            selected_feeds.append(booster.first())

    elif session_number == 2:
        if energy.exists():
            selected_feeds.append(energy.first())

    elif session_number == 3:
        if supplement.exists():
            selected_feeds.append(supplement.first())

    elif session_number >= 4:
        if supplement.exists():
            selected_feeds.append(supplement.first())
        elif booster.exists():
            selected_feeds.append(booster.first())

    return list({f.id: f for f in selected_feeds}.values())