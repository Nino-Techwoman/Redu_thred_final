// activity page javascript

// this saves the theme when page loads
let raw = localStorage.getItem('threads_theme');
let savedTheme = 'auto';
if (raw) {
    savedTheme = JSON.parse(raw);
}
if (savedTheme == 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
} else if (savedTheme == 'light') {
    document.documentElement.removeAttribute('data-theme');
} else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// sample activity data
function getSampleActivity() {
    let activities = [
        {
            id: 1,
            type: 'followed',
            username: 'gkurtskhalia',
            avatar: 'images/avatar1.jpg',
            time: '10w',
            isFollowing: false
        },
        {
            id: 2,
            type: 'followed',
            username: 'copurashvili',
            avatar: 'images/avatar2.jpg',
            time: '11w',
            isFollowing: false
        },
        {
            id: 3,
            type: 'followed',
            username: 'ekaterinebendeliani',
            avatar: 'images/avatar3.jpg',
            time: '13w',
            isFollowing: false
        },
        {
            id: 4,
            type: 'suggestion',
            username: 'mamukanacvaladze',
            avatar: 'images/avatar4.jpg',
            time: '24w',
            isFollowing: false
        },
        {
            id: 5,
            type: 'suggested_thread',
            username: 'mamukalasareishvili',
            avatar: 'images/avatar5.jpg',
            time: '24w',
            postText: '@noahaoahoaa მოგესალმებო ლამაზო',
            likes: 4,
            comments: 5
        },
        {
            id: 6,
            type: 'suggestion',
            username: 'c0sta884',
            avatar: 'images/avatar1.jpg',
            time: '25w',
            isFollowing: false
        },
        {
            id: 7,
            type: 'suggestion',
            username: 'vazha.v1',
            avatar: 'images/avatar2.jpg',
            time: '26w',
            isFollowing: false
        }
    ];
    return activities;
}

// render activity list
function renderActivityList() {
    console.log('rendering activity list');
    let list = document.getElementById('activityList');
    if (list == null) {
        console.log('list not found');
        return;
    }

    let activities = getSampleActivity();
    list.innerHTML = '';

    for (let i = 0; i < activities.length; i++) {
        let activity = activities[i];
        let item = createActivityItem(activity);
        list.appendChild(item);
    }
    console.log('done rendering');
}

// create activity item element
function createActivityItem(activity) {
    let div = document.createElement('div');
    div.className = 'activity-item';
    div.dataset.id = activity.id;

    // figure out the type text
    let typeText = '';
    let actionHtml = '';

    if (activity.type == 'followed') {
        typeText = 'Followed you';
        actionHtml = '<button class="follow-btn" data-id="' + activity.id + '">Follow back</button>';
    }
    if (activity.type == 'suggestion') {
        typeText = 'Follow suggestion';
        actionHtml = '<button class="follow-btn" data-id="' + activity.id + '">Follow</button>';
    }
    if (activity.type == 'suggested_thread') {
        typeText = 'Suggested thread';
    }

    // build post preview html
    let postPreviewHtml = '';
    if (activity.type == 'suggested_thread') {
        if (activity.postText) {
            postPreviewHtml = postPreviewHtml + '<div class="activity-post-preview">' + activity.postText + '</div>';
            postPreviewHtml = postPreviewHtml + '<div class="activity-post-actions">';
            postPreviewHtml = postPreviewHtml + '<button class="activity-action-btn">';
            postPreviewHtml = postPreviewHtml + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">';
            postPreviewHtml = postPreviewHtml + '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>';
            postPreviewHtml = postPreviewHtml + '</svg>';
            if (activity.likes) {
                postPreviewHtml = postPreviewHtml + activity.likes;
            }
            postPreviewHtml = postPreviewHtml + '</button>';
            postPreviewHtml = postPreviewHtml + '<button class="activity-action-btn">';
            postPreviewHtml = postPreviewHtml + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">';
            postPreviewHtml = postPreviewHtml + '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>';
            postPreviewHtml = postPreviewHtml + '</svg>';
            if (activity.comments) {
                postPreviewHtml = postPreviewHtml + activity.comments;
            }
            postPreviewHtml = postPreviewHtml + '</button>';
            postPreviewHtml = postPreviewHtml + '<button class="activity-action-btn">';
            postPreviewHtml = postPreviewHtml + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">';
            postPreviewHtml = postPreviewHtml + '<path d="M17 1l4 4-4 4"/>';
            postPreviewHtml = postPreviewHtml + '<path d="M3 11V9a4 4 0 0 1 4-4h14"/>';
            postPreviewHtml = postPreviewHtml + '<path d="M7 23l-4-4 4-4"/>';
            postPreviewHtml = postPreviewHtml + '<path d="M21 13v2a4 4 0 0 1-4 4H3"/>';
            postPreviewHtml = postPreviewHtml + '</svg>';
            postPreviewHtml = postPreviewHtml + '</button>';
            postPreviewHtml = postPreviewHtml + '<button class="activity-action-btn">';
            postPreviewHtml = postPreviewHtml + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">';
            postPreviewHtml = postPreviewHtml + '<line x1="22" y1="2" x2="11" y2="13"/>';
            postPreviewHtml = postPreviewHtml + '<polygon points="22 2 15 22 11 13 2 9 22 2"/>';
            postPreviewHtml = postPreviewHtml + '</svg>';
            postPreviewHtml = postPreviewHtml + '</button>';
            postPreviewHtml = postPreviewHtml + '</div>';
        }
    }

    // build the main html
    let html = '';
    html = html + '<div class="activity-avatar-wrapper">';
    html = html + '<img src="' + activity.avatar + '" alt="' + activity.username + '" class="activity-avatar">';
    html = html + '<div class="activity-badge">';
    html = html + '<svg viewBox="0 0 24 24" fill="currentColor">';
    html = html + '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>';
    html = html + '</svg>';
    html = html + '</div>';
    html = html + '</div>';
    html = html + '<div class="activity-content">';
    html = html + '<div class="activity-header-row">';
    html = html + '<span class="activity-username">' + activity.username + '</span>';
    html = html + '<span class="activity-time">' + activity.time + '</span>';
    html = html + '</div>';
    html = html + '<div class="activity-type">' + typeText + '</div>';
    html = html + postPreviewHtml;
    html = html + '</div>';
    if (actionHtml != '') {
        html = html + '<div class="activity-action">' + actionHtml + '</div>';
    }

    div.innerHTML = html;

    // add follow button click handler
    let followBtn = div.querySelector('.follow-btn');
    if (followBtn != null) {
        followBtn.onclick = function() {
            console.log('follow button clicked');
            if (this.classList.contains('following')) {
                this.classList.remove('following');
                if (activity.type == 'followed') {
                    this.textContent = 'Follow back';
                } else {
                    this.textContent = 'Follow';
                }
            } else {
                this.classList.add('following');
                this.textContent = 'Following';
            }
        };
    }

    return div;
}

// get search suggestions
function getSearchSuggestions() {
    let suggestions = [
        {
            id: 101,
            username: 'womenqu0tes',
            name: 'Women Quotes 💗',
            bio: '👉 Letting Me Go Will Be the Only Thing You Will Regret Your Whole Life...! 🖤\n💗 Love | Dating | Relationship Quotes',
            followers: '120K followers',
            avatar: 'images/avatar1.jpg',
            verified: false
        },
        {
            id: 102,
            username: 'ashlaysoto',
            name: 'Ashley soto',
            bio: 'Texas girl ❤️ Mom of 3\ntiktok: ash_lay\nBusiness: ashleysotobusiness@yahoo.com SNAP: ash_layN',
            followers: '39.4K followers',
            avatar: 'images/avatar2.jpg',
            verified: true
        },
        {
            id: 103,
            username: 'dr.samkharadze',
            name: 'Dr. Giorgi Samkharadze',
            bio: 'სამედიცინო-სარეაბილიტაციო ბლოგი',
            followers: '15.2K followers',
            avatar: 'images/avatar3.jpg',
            verified: false
        },
        {
            id: 104,
            username: 'techguru_mike',
            name: 'Mike Johnson',
            bio: '💻 Tech enthusiast | Software Developer\n🚀 Building the future one line at a time\n📱 iOS & Android tips',
            followers: '85.3K followers',
            avatar: 'images/avatar4.jpg',
            verified: true
        },
        {
            id: 105,
            username: 'foodie_adventures',
            name: 'Sarah Chen',
            bio: '🍕 Food blogger | Recipe creator\n📍 NYC based\n✨ Making everyday meals extraordinary',
            followers: '256K followers',
            avatar: 'images/avatar5.jpg',
            verified: true
        },
        {
            id: 106,
            username: 'fitness_maria',
            name: 'Maria Rodriguez',
            bio: '💪 Certified Personal Trainer\n🏋️ Transform your body & mind\n📩 DM for coaching',
            followers: '67.8K followers',
            avatar: 'images/avatar1.jpg',
            verified: false
        },
        {
            id: 107,
            username: 'travel.with.alex',
            name: 'Alex Thompson',
            bio: '✈️ 50+ countries explored\n📸 Travel photographer\n🌍 Adventure awaits everywhere',
            followers: '198K followers',
            avatar: 'images/avatar2.jpg',
            verified: true
        },
        {
            id: 108,
            username: 'artbyemma',
            name: 'Emma Wilson',
            bio: '🎨 Digital artist & illustrator\n🖼️ Commissions open\n💫 Turning imagination into art',
            followers: '43.2K followers',
            avatar: 'images/avatar3.jpg',
            verified: false
        },
        {
            id: 109,
            username: 'startup_daily',
            name: 'Startup Daily',
            bio: '📈 Startup news & insights\n💡 Entrepreneur tips\n🎯 Building successful businesses',
            followers: '312K followers',
            avatar: 'images/avatar4.jpg',
            verified: true
        },
        {
            id: 110,
            username: 'music_vibes_official',
            name: 'Music Vibes',
            bio: '🎵 Daily music recommendations\n🎧 All genres | All moods\n🔥 New releases every day',
            followers: '89.5K followers',
            avatar: 'images/avatar5.jpg',
            verified: false
        },
        {
            id: 111,
            username: 'naturelover_james',
            name: 'James Nature',
            bio: '🌲 Wildlife photographer\n🦁 Safari guide\n📷 Capturing nature\'s beauty',
            followers: '156K followers',
            avatar: 'images/avatar1.jpg',
            verified: true
        },
        {
            id: 112,
            username: 'yoga_with_lisa',
            name: 'Lisa Yoga',
            bio: '🧘‍♀️ Certified yoga instructor\n🌸 Mind, body & soul\n✨ Daily practice tips',
            followers: '92.1K followers',
            avatar: 'images/avatar2.jpg',
            verified: false
        },
        {
            id: 113,
            username: 'coffeeaddicts',
            name: 'Coffee Addicts',
            bio: '☕ Coffee lovers community\n🫘 Bean reviews & brewing tips\n📍 Best cafes worldwide',
            followers: '215K followers',
            avatar: 'images/avatar3.jpg',
            verified: true
        },
        {
            id: 114,
            username: 'bookworm_reads',
            name: 'Bookworm Reads',
            bio: '📚 Book reviews & recommendations\n🔖 All genres welcome\n💬 Join our reading club',
            followers: '78.4K followers',
            avatar: 'images/avatar4.jpg',
            verified: false
        },
        {
            id: 115,
            username: 'gaming_pro_max',
            name: 'Gaming Pro',
            bio: '🎮 Pro gamer & streamer\n🏆 Tournament champion\n📺 Twitch: gaming_pro_max',
            followers: '445K followers',
            avatar: 'images/avatar5.jpg',
            verified: true
        }
    ];
    return suggestions;
}

// render search suggestions
function renderSearchSuggestions() {
    let searchSuggestionsList = document.getElementById('searchSuggestionsList');
    if (searchSuggestionsList == null) {
        return;
    }

    let suggestions = getSearchSuggestions();
    searchSuggestionsList.innerHTML = '';

    for (let i = 0; i < suggestions.length; i++) {
        let suggestion = suggestions[i];
        let item = document.createElement('div');
        item.className = 'search-suggestion-item';

        // build verified icon html
        let verifiedIcon = '';
        if (suggestion.verified == true) {
            verifiedIcon = '<svg class="search-suggestion-verified" viewBox="0 0 24 24" fill="currentColor">';
            verifiedIcon = verifiedIcon + '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>';
            verifiedIcon = verifiedIcon + '</svg>';
        }

        // replace newlines in bio
        let bioText = suggestion.bio;
        // replace new lines with html line breaks
        bioText = bioText.replace(/\n/g, '<br>');

        // build the html
        let html = '';
        html = html + '<img src="' + suggestion.avatar + '" alt="' + suggestion.username + '" class="search-suggestion-avatar">';
        html = html + '<div class="search-suggestion-info">';
        html = html + '<div class="search-suggestion-header">';
        html = html + '<span class="search-suggestion-username">' + suggestion.username + '</span>';
        html = html + verifiedIcon;
        html = html + '</div>';
        html = html + '<div class="search-suggestion-name">' + suggestion.name + '</div>';
        html = html + '<div class="search-suggestion-bio">' + bioText + '</div>';
        html = html + '<div class="search-suggestion-followers">' + suggestion.followers + '</div>';
        html = html + '</div>';
        html = html + '<div class="search-suggestion-action">';
        html = html + '<button class="search-suggestion-follow-btn" data-id="' + suggestion.id + '">Follow</button>';
        html = html + '</div>';

        item.innerHTML = html;

        // add click handler to follow button
        let followBtn = item.querySelector('.search-suggestion-follow-btn');
        followBtn.onclick = function() {
            console.log('search follow clicked');
            if (this.classList.contains('following')) {
                this.classList.remove('following');
                this.textContent = 'Follow';
            } else {
                this.classList.add('following');
                this.textContent = 'Following';
            }
        };

        searchSuggestionsList.appendChild(item);
    }
}

// initialize the page
function init() {
    console.log('init started');

    // check if logged in
    let isLoggedIn = localStorage.getItem('threads_is_logged_in');
    if (isLoggedIn != 'true') {
        console.log('not logged in, redirecting');
        window.location.href = 'login.html';
        return;
    }

    renderActivityList();

    // get elements
    let activityDropdownBtn = document.getElementById('activityDropdownBtn');
    let activityDropdown = document.getElementById('activityDropdown');
    let activityMoreBtn = document.getElementById('activityMoreBtn');
    let activityMoreDropdown = document.getElementById('activityMoreDropdown');
    let modalOverlay = document.getElementById('modalOverlay');
    let createPostClose = document.getElementById('createPostClose');
    let createPostAvatar = document.getElementById('createPostAvatar');
    let createPostAvatarSmall = document.getElementById('createPostAvatarSmall');
    let createPostUsername = document.getElementById('createPostUsername');
    let createPostText = document.getElementById('createPostText');
    let postBtn = document.getElementById('postBtn');
    let fab = document.getElementById('fab');
    let searchModalOverlay = document.getElementById('searchModalOverlay');
    let moreMenuBtn = document.getElementById('moreMenuBtn');
    let moreMenuDropdown = document.getElementById('moreMenuDropdown');
    let draftsBtn = document.getElementById('draftsBtn');
    let draftsView = document.getElementById('draftsView');
    let draftsBackBtn = document.getElementById('draftsBackBtn');
    let createPostForm = document.getElementById('createPostForm');

    // load user info for modal
    let currentUserData = localStorage.getItem('threads_user');
    let currentUser = {};
    if (currentUserData != null) {
        currentUser = JSON.parse(currentUserData);
    }
    if (createPostAvatar != null) {
        if (currentUser.avatar) {
            createPostAvatar.src = currentUser.avatar;
        } else {
            createPostAvatar.src = 'images/avatar1.jpg';
        }
    }
    if (createPostAvatarSmall != null) {
        if (currentUser.avatar) {
            createPostAvatarSmall.src = currentUser.avatar;
        } else {
            createPostAvatarSmall.src = 'images/avatar1.jpg';
        }
    }
    if (createPostUsername != null) {
        if (currentUser.username) {
            createPostUsername.textContent = currentUser.username;
        } else {
            createPostUsername.textContent = 'user';
        }
    }

    // activity dropdown button
    if (activityDropdownBtn != null && activityDropdown != null) {
        activityDropdownBtn.onclick = function(e) {
            // stop click from closing menu
            e.stopPropagation();
            if (activityDropdown.classList.contains('active')) {
                activityDropdown.classList.remove('active');
            } else {
                activityDropdown.classList.add('active');
            }
        };

        // close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (activityDropdown.contains(e.target) == false && e.target != activityDropdownBtn) {
                activityDropdown.classList.remove('active');
            }
        });

        // filter selection
        let filterItems = document.querySelectorAll('.activity-dropdown-item');
        for (let i = 0; i < filterItems.length; i++) {
            filterItems[i].onclick = function(e) {
                // stop click from closing menu
                e.stopPropagation();
                // remove active from all
                let allItems = document.querySelectorAll('.activity-dropdown-item');
                for (let j = 0; j < allItems.length; j++) {
                    allItems[j].classList.remove('active');
                }
                // add active to clicked
                this.classList.add('active');
                // close dropdown
                activityDropdown.classList.remove('active');
            };
        }
    }

    // activity more dropdown
    if (activityMoreBtn != null && activityMoreDropdown != null) {
        activityMoreBtn.onclick = function(e) {
            // stop click from closing menu
            e.stopPropagation();
            if (activityMoreDropdown.classList.contains('active')) {
                activityMoreDropdown.classList.remove('active');
            } else {
                activityMoreDropdown.classList.add('active');
            }
            // close the filter dropdown if open
            if (activityDropdown != null) {
                activityDropdown.classList.remove('active');
            }
        };

        // close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (activityMoreDropdown.contains(e.target) == false && e.target != activityMoreBtn) {
                activityMoreDropdown.classList.remove('active');
            }
        });
    }

    // close search modal when clicking overlay
    if (searchModalOverlay != null) {
        searchModalOverlay.onclick = function(e) {
            if (e.target == searchModalOverlay) {
                searchModalOverlay.classList.remove('active');
            }
        };
    }

    // more menu dropdown
    if (moreMenuBtn != null && moreMenuDropdown != null) {
        moreMenuBtn.onclick = function(e) {
            // stop click from closing menu
            e.stopPropagation();
            if (moreMenuDropdown.classList.contains('active')) {
                moreMenuDropdown.classList.remove('active');
            } else {
                moreMenuDropdown.classList.add('active');
            }
        };

        document.addEventListener('click', function(e) {
            if (moreMenuDropdown.contains(e.target) == false && e.target != moreMenuBtn) {
                moreMenuDropdown.classList.remove('active');
            }
        });
    }

    // drafts view toggle (inside same modal)
    if (draftsBtn != null && draftsView != null && createPostForm != null) {
        draftsBtn.onclick = function(e) {
            // stop click from bubbling up
            e.stopPropagation();
            createPostForm.style.display = 'none';
            draftsView.style.display = 'flex';
        };
        if (draftsBackBtn != null) {
            draftsBackBtn.onclick = function(e) {
                // stop click from bubbling up
                e.stopPropagation();
                draftsView.style.display = 'none';
                createPostForm.style.display = '';
            };
        }
    }

    // open modal from FAB
    if (fab != null) {
        fab.onclick = function() {
            if (modalOverlay != null) {
                modalOverlay.classList.add('from-fab');
                modalOverlay.classList.add('active');
            }
            fab.style.display = 'none';
        };
    }

    function closeModal() {
        if (modalOverlay != null) {
            modalOverlay.classList.remove('active');
            modalOverlay.classList.remove('from-fab');
        }
        if (fab != null) fab.style.display = '';
    }

    // close modal
    if (createPostClose != null) {
        createPostClose.onclick = closeModal;
    }

    // close modal when clicking overlay
    if (modalOverlay != null) {
        modalOverlay.onclick = function(e) {
            if (e.target == modalOverlay) {
                closeModal();
            }
        };
    }

    // enable/disable post button based on text
    let addThreadText = document.querySelector('.add-thread-text');
    let addThreadAvatar = document.querySelector('.create-post-avatar-small');

    if (createPostText != null && postBtn != null) {
        createPostText.addEventListener('input', function() {
            let text = this.value.trim();
            if (text != '') {
                postBtn.disabled = false;
                postBtn.removeAttribute('disabled');
                if (addThreadText != null) {
                    addThreadText.classList.add('active');
                }
                if (addThreadAvatar != null) {
                    addThreadAvatar.classList.add('active');
                }
            } else {
                postBtn.disabled = true;
                if (addThreadText != null) {
                    addThreadText.classList.remove('active');
                }
                if (addThreadAvatar != null) {
                    addThreadAvatar.classList.remove('active');
                }
            }
        });
    }

    // navigation
    let navBtns = document.querySelectorAll('.nav-btn[data-tab]');
    for (let i = 0; i < navBtns.length; i++) {
        navBtns[i].addEventListener('click', function(e) {
            e.preventDefault();
            // stop click from bubbling up
            e.stopPropagation();
            let tab = this.getAttribute('data-tab');
            console.log('nav clicked: ' + tab);
            if (tab == 'home') {
                window.location.href = 'home.html';
            }
            if (tab == 'profile') {
                window.location.href = 'profile.html';
            }
            if (tab == 'create') {
                if (modalOverlay != null) {
                    modalOverlay.classList.add('active');
                }
            }
            if (tab == 'search') {
                if (searchModalOverlay != null) {
                    renderSearchSuggestions();
                    searchModalOverlay.classList.add('active');
                }
            }
            if (tab == 'activity') {
                window.scrollTo(0, 0);
            }
        });
    }

    console.log('init done');
}

// wait for page to load
document.addEventListener('DOMContentLoaded', init);
