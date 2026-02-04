// home page javascript

// theme sync when page loads
let raw = localStorage.getItem('threads_theme');
let savedTheme = 'auto';
if (raw) {
    savedTheme = JSON.parse(raw);
}
if (savedTheme == 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
} else if (savedTheme == 'dark') {
    document.documentElement.removeAttribute('data-theme');
} else {
    if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// global variables
let currentUser = null;
let feedPosts = [];
let postRateLimiter = createRateLimiter(10, 60000); // 10 posts per minute

// load from storage
function loadFromStorage(key) {
    let data = localStorage.getItem(key);
    if (data != null) {
        return JSON.parse(data);
    }
    return null;
}

// save to storage
function saveToStorage(key, data) {
    console.log("saving: " + key);
    localStorage.setItem(key, JSON.stringify(data));
}

// get random avatar
function getRandomAvatar() {
    return 'images/avatar' + (Math.floor(Math.random() * 5) + 1) + '.jpg';
}

// get sample posts
function getSamplePosts() {
    let posts = [
        { id: 1, username: "keny.vee", name: "Kenny V", avatar: "images/avatar1.jpg", verified: true, text: "", quote: { username: "keny.vee", avatar: "images/avatar1.jpg", text: "A bad manager can turn you into a great entrepreneur.", highlight: "great entrepreneur", dark: false }, time: "23h", likes: 469, replies: 10, reposts: 45, shares: 50, liked: false },
        { id: 2, username: "bobbydelrio", name: "Bobby Del Rio", avatar: "images/avatar2.jpg", verified: false, text: "Green for envy.", quote: { username: "bobbydelrio", avatar: "images/avatar2.jpg", text: "Social media is viciously competitive now.", highlight: "viciously competitive", dark: false }, time: "6h", likes: 62, replies: 0, reposts: 2, shares: 38, liked: false },
        { id: 3, username: "a.g.e.co", name: "AGE Co", avatar: "images/avatar3.jpg", verified: false, text: "Artist to artist what's your thoughts ?", quote: { username: "druwmelo", avatar: "images/avatar4.jpg", text: "Being an artist is a long game nobody respects.", highlight: "artist is a long game", dark: false }, time: "1h", likes: 0, replies: 0, reposts: 0, shares: 0, liked: false },
        { id: 4, username: "sarah.designs", name: "Sarah Mitchell", avatar: "images/avatar5.jpg", verified: true, text: "Just launched my new portfolio website! What do you think? Link in bio.", quote: null, time: "2h", likes: 234, replies: 45, reposts: 12, shares: 89, liked: false },
        { id: 5, username: "tech.guru", name: "Alex Chen", avatar: "images/avatar1.jpg", verified: true, text: "AI is not going to replace you. A person using AI will.", quote: null, time: "4h", likes: 1289, replies: 156, reposts: 342, shares: 567, liked: false },
        { id: 6, username: "maya.wellness", name: "Maya Johnson", avatar: "images/avatar2.jpg", verified: false, text: "Morning routine update: meditation, journaling, and a long walk. Life changing.", quote: null, time: "5h", likes: 89, replies: 12, reposts: 5, shares: 23, liked: false },
        { id: 7, username: "foodie.adventures", name: "Marco Rossi", avatar: "images/avatar3.jpg", verified: false, text: "", quote: { username: "chef.antonio", avatar: "images/avatar4.jpg", text: "The secret to great pasta is patience and quality ingredients.", highlight: "patience and quality", dark: false }, time: "8h", likes: 156, replies: 23, reposts: 8, shares: 45, liked: false },
        { id: 8, username: "fitness.mike", name: "Mike Thompson", avatar: "images/avatar5.jpg", verified: true, text: "Consistency beats intensity. Show up every day, even when you don't feel like it.", quote: null, time: "10h", likes: 567, replies: 89, reposts: 123, shares: 234, liked: false },
        { id: 9, username: "travel.emma", name: "Emma Watson", avatar: "images/avatar1.jpg", verified: false, text: "Just booked a one-way ticket to Bali. Sometimes you just need to go.", quote: null, time: "12h", likes: 892, replies: 134, reposts: 67, shares: 189, liked: false },
        { id: 10, username: "dev.jason", name: "Jason Park", avatar: "images/avatar2.jpg", verified: true, text: "Hot take: Most coding tutorials are too long. Get to the point.", quote: null, time: "15h", likes: 2341, replies: 456, reposts: 234, shares: 678, liked: false },
        { id: 11, username: "music.vibes", name: "Luna Ray", avatar: "images/avatar3.jpg", verified: false, text: "New song dropping Friday. This one is different.", quote: null, time: "18h", likes: 445, replies: 67, reposts: 34, shares: 123, liked: false },
        { id: 12, username: "startup.life", name: "Ryan Cooper", avatar: "images/avatar4.jpg", verified: true, text: "", quote: { username: "investor.daily", avatar: "images/avatar5.jpg", text: "The best time to start was yesterday. The second best time is now.", highlight: "second best time is now", dark: false }, time: "20h", likes: 789, replies: 45, reposts: 156, shares: 234, liked: false }
    ];
    return posts;
}

// random users for generating new posts
let randomUsers = [
    { username: "lily.writes", name: "Lily Chen", avatar: "images/avatar1.jpg", verified: false },
    { username: "jake.photo", name: "Jake Morrison", avatar: "images/avatar2.jpg", verified: true },
    { username: "nina.codes", name: "Nina Patel", avatar: "images/avatar3.jpg", verified: false },
    { username: "omar.design", name: "Omar Hassan", avatar: "images/avatar4.jpg", verified: true },
    { username: "chloe.fit", name: "Chloe Adams", avatar: "images/avatar5.jpg", verified: false },
    { username: "marcus.dev", name: "Marcus Lee", avatar: "images/avatar1.jpg", verified: true },
    { username: "sofia.art", name: "Sofia Rivera", avatar: "images/avatar2.jpg", verified: false },
    { username: "daniel.music", name: "Daniel Kim", avatar: "images/avatar3.jpg", verified: false },
    { username: "emma.travel", name: "Emma Brooks", avatar: "images/avatar4.jpg", verified: true },
    { username: "leo.startup", name: "Leo Zhang", avatar: "images/avatar5.jpg", verified: false }
];

let nextId = 3000;

let randomTexts = [
    "Just had the best coffee of my life. No cap.",
    "Why does nobody talk about how hard it is to stay consistent?",
    "New project dropping soon. Stay tuned.",
    "Hot take: sleep is more important than hustle.",
    "Sometimes you gotta log off and go outside.",
    "The algorithm is wild today lol",
    "Working on something big. Can't share yet but trust me.",
    "Unpopular opinion: remote work is overrated.",
    "Finally finished that book I've been reading for 3 months.",
    "Grateful for the small wins today.",
    "Anyone else feel like time is moving faster this year?",
    "Don't let anyone rush your process.",
    "Morning walks changed my life. Not even kidding.",
    "Just deleted all my social media apps. Wait...",
    "The sunset tonight was unreal.",
    "Stop scrolling and go drink some water.",
    "I think I finally understand what balance means.",
    "Learning to say no is a superpower.",
    "Just shipped a feature I've been working on for weeks.",
    "Friendly reminder: you don't owe anyone an explanation.",
    "This week hit different. In a good way.",
    "Less talking, more doing. That's the vibe for 2025.",
    "Found the best playlist for late night coding sessions.",
    "Your network is your net worth. Real talk.",
    "Started journaling and wow, the clarity is insane."
];

// generate random posts
function getRandomPosts() {
    let posts = [];
    let count = 6 + Math.floor(Math.random() * 5); // 6 to 10 posts
    let usedTexts = [];

    for (let i = 0; i < count; i++) {
        let user = randomUsers[Math.floor(Math.random() * randomUsers.length)];
        // pick a text we havent used yet
        let textIndex = Math.floor(Math.random() * randomTexts.length);
        while (usedTexts.indexOf(textIndex) != -1 && usedTexts.length < randomTexts.length) {
            textIndex = Math.floor(Math.random() * randomTexts.length);
        }
        usedTexts.push(textIndex);

        let hours = Math.floor(Math.random() * 23) + 1;
        let timeStr = hours + 'h';

        posts.push({
            id: nextId++,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            verified: user.verified,
            text: randomTexts[textIndex],
            quote: null,
            time: timeStr,
            likes: Math.floor(Math.random() * 500),
            replies: Math.floor(Math.random() * 50),
            reposts: Math.floor(Math.random() * 30),
            shares: Math.floor(Math.random() * 100),
            liked: false
        });
    }
    return posts;
}

// get following feed posts
function getFollowingPosts() {
    let posts = [
        {
            id: 2001, username: "ruska_star6", name: "Ruska Star", avatar: "images/avatar1.jpg", verified: false,
            text: "Sometimes you just need to take a step back and appreciate how far you've come. The journey is never easy but it's always worth it.\n\nLet's keep pushing forward together.\nEvery single day matters.",
            hasTranslate: true, quote: null, time: "3h", likes: 142, replies: 18, reposts: 7, shares: 23, liked: false
        },
        {
            id: 2002, username: "luissousacunha", name: "Luis Sousa Cunha", avatar: "images/avatar2.jpg", verified: false,
            text: "Georgia is going through draconian times.",
            quote: null, time: "16h", likes: 89, replies: 34, reposts: 12, shares: 45, liked: false
        },
        {
            id: 2003, username: "karchavadato", name: "Karchava Dato", avatar: "images/avatar3.jpg", verified: false,
            text: "My top 12 favorite guitarists of all time. The list keeps changing every year but these legends always stay.\n\nDrop yours in the comments!",
            quote: null, time: "1d", likes: 312, replies: 87, reposts: 24, shares: 56, liked: false
        },
        {
            id: 2004, username: "appleboxkit", name: "AppleBox Kit", avatar: "images/avatar4.jpg", verified: false,
            text: "Iced coffee over sunset yesterday's photowalk, today's memory. The light was perfect.\n@streetphotog @citylights\n\n#StreetPhotography #BlackAndWhite #StillStories #VisualStorytelling",
            images: [
                "images/post1.jpg",
                "images/post2.jpg",
                "images/post3.jpg"
            ],
            quote: null, time: "21/01/2026", likes: 456, replies: 23, reposts: 34, shares: 78, liked: false
        },
        {
            id: 2005, username: "travel.adventures", name: "Travel Adventures", avatar: "images/avatar5.jpg", verified: true,
            text: "The mountains don't care about your deadlines. Take a break.\n\n#NaturePhotography #Mountains #Hiking #EverydayAdventure",
            images: [
                "images/post4.jpg",
                "images/post1.jpg"
            ],
            quote: null, time: "5h", likes: 1023, replies: 67, reposts: 145, shares: 234, liked: false
        },
        {
            id: 2006, username: "daily.wisdom", name: "Daily Wisdom", avatar: "images/avatar1.jpg", verified: true,
            text: "The hardest part about growing up is realizing that not everyone has the same heart as you.",
            hasTranslate: true, quote: null, time: "8h", likes: 2341, replies: 123, reposts: 456, shares: 789, liked: false
        },
        {
            id: 2007, username: "coffeecraft", name: "Coffee Craft", avatar: "images/avatar2.jpg", verified: false,
            text: "Morning ritual complete. There's something about the first sip that makes everything feel possible.\n\n#CoffeeLover #MorningVibes #LatteArt",
            images: [
                "images/post2.jpg"
            ],
            quote: null, time: "2h", likes: 178, replies: 12, reposts: 5, shares: 34, liked: false
        },
        {
            id: 2008, username: "dev.thoughts", name: "Dev Thoughts", avatar: "images/avatar3.jpg", verified: true,
            text: "Unpopular opinion: writing documentation is just as important as writing code. Your future self will thank you.",
            quote: null, time: "12h", likes: 567, replies: 89, reposts: 123, shares: 234, liked: false
        },
        {
            id: 2009, username: "artbylex", name: "Lex Art", avatar: "images/avatar4.jpg", verified: false,
            text: "New piece finished. Took me 3 weeks but I'm really happy with how it turned out.\n\n#DigitalArt #CreativeProcess #ArtistsOfThreads",
            images: [
                "images/post3.jpg"
            ],
            quote: null, time: "1d", likes: 892, replies: 156, reposts: 67, shares: 189, liked: false
        },
        {
            id: 2010, username: "fitness.daily", name: "Fitness Daily", avatar: "images/avatar5.jpg", verified: false,
            text: "Day 90 of consistent training. The results speak for themselves. No shortcuts, just discipline.\n\nWho's with me?",
            quote: null, time: "4h", likes: 345, replies: 45, reposts: 23, shares: 67, liked: false
        }
    ];
    return posts;
}

// render feed
function renderFeed() {
    console.log("rendering feed");
    let feed = document.getElementById('feed');
    if (feed == null) {
        return;
    }
    feed.innerHTML = '';
    for (let i = 0; i < feedPosts.length; i++) {
        let post = feedPosts[i];
        let postEl = createPostElement(post);
        feed.appendChild(postEl);
    }
}

// create post element
function createPostElement(post) {
    let div = document.createElement('div');
    div.className = 'post';
    div.dataset.id = post.id;

    // build quote html (sanitized)
    let quoteHtml = '';
    if (post.quote != null) {
        let safeQuoteText = sanitize(post.quote.text);
        let highlightedText = safeQuoteText;
        if (post.quote.highlight) {
            let safeHighlight = sanitize(post.quote.highlight);
            highlightedText = safeQuoteText.replace(safeHighlight, '<span class="highlight">' + safeHighlight + '</span>');
        }
        let darkClass = '';
        if (post.quote.dark == true) {
            darkClass = ' dark';
        }
        let safeQuoteUsername = sanitize(post.quote.username);
        quoteHtml = '<div class="quoted-post' + darkClass + '">';
        quoteHtml = quoteHtml + '<div class="quoted-header">';
        quoteHtml = quoteHtml + '<img src="' + encodeURI(post.quote.avatar) + '" alt="' + safeQuoteUsername + '" class="quoted-avatar">';
        quoteHtml = quoteHtml + '<span class="quoted-username">' + safeQuoteUsername + '</span>';
        quoteHtml = quoteHtml + '</div>';
        quoteHtml = quoteHtml + '<p class="quoted-text">' + highlightedText + '</p>';
        quoteHtml = quoteHtml + '</div>';
    }

    // build image html
    let imageHtml = '';
    if (post.images != null && post.images.length > 0) {
        // multiple images gallery
        if (post.images.length == 1) {
            imageHtml = '<img src="' + post.images[0] + '" alt="Post image" class="post-image">';
        } else {
            imageHtml = '<div class="post-image-gallery">';
            for (let img = 0; img < post.images.length; img++) {
                imageHtml = imageHtml + '<img src="' + post.images[img] + '" alt="Post image" class="post-gallery-img">';
            }
            imageHtml = imageHtml + '</div>';
        }
    } else if (post.image != null) {
        if (post.image.indexOf('data:image') == 0 || post.image.match(/\.(jpg|jpeg|png|gif|webp)($|\?)/i)) {
            imageHtml = '<img src="' + post.image + '" alt="Post image" class="post-image">';
        }
    }

    // build verified icon
    let verifiedHtml = '';
    if (post.verified == true) {
        verifiedHtml = '<img src="icons/verified.svg" alt="Verified" class="post-verified">';
    }

    // build text html (sanitized)
    let textHtml = '';
    if (post.text) {
        let safeText = sanitize(post.text);
        // turn hashtags into styled spans
        safeText = safeText.replace(/#(\w+)/g, '<span class="post-hashtag">#$1</span>');
        // turn @mentions into styled spans
        safeText = safeText.replace(/@(\w+)/g, '<span class="post-mention">@$1</span>');
        // keep line breaks
        safeText = safeText.replace(/\n/g, '<br>');
        textHtml = '<p class="post-text">' + safeText + '</p>';
        if (post.hasTranslate) {
            textHtml = textHtml + '<button class="post-translate-btn">Translate</button>';
        }
    }

    // build likes count
    let likesHtml = '';
    if (post.likes > 0) {
        likesHtml = '<span>' + post.likes + '</span>';
    }

    // build replies count
    let repliesHtml = '';
    if (post.replies > 0) {
        repliesHtml = '<span>' + post.replies + '</span>';
    }

    // build reposts count
    let repostsHtml = '';
    if (post.reposts > 0) {
        repostsHtml = '<span>' + post.reposts + '</span>';
    }

    // build shares count
    let sharesHtml = '';
    if (post.shares > 0) {
        sharesHtml = '<span>' + post.shares + '</span>';
    }

    // build liked class
    let likedClass = '';
    if (post.liked == true) {
        likedClass = ' liked';
    }

    // build the full html (sanitized user content)
    let safeUsername = sanitize(post.username);
    let safeAvatar = encodeURI(post.avatar);
    let html = '';
    html = html + '<div class="post-avatar-container">';
    html = html + '<img src="' + safeAvatar + '" alt="' + safeUsername + '" class="post-avatar">';
    html = html + '<div class="post-line"></div>';
    html = html + '</div>';
    html = html + '<div class="post-content">';
    html = html + '<div class="post-header">';
    html = html + '<span class="post-username">' + safeUsername + '</span>';
    html = html + verifiedHtml;
    html = html + '<span class="post-time">' + post.time + '</span>';
    html = html + '<div class="post-header-icons">';
    html = html + '<button class="post-icon-btn post-markup-btn">';
    html = html + '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.651 4.148c-.414-.372-4.117-3.573-6.28-1.335-1.764 1.825.155 4.336 1.077 5.543l.221.29c.067.091.161.207.27.34.903 1.104 1.242 1.8 1.008 2.07-.443.512-1.674-.39-3.24-1.622-.55-.433-1.118-.88-1.693-1.273-1.55-1.058-3.526-2.062-5.058-.435-.912.969-1.329 2.764 1.864 5.811.269.257.562.526.866.804 1.776 1.63 3.987 3.657 3.193 5.073a1.067 1.067 0 0 1-.856.571c-1.243.177-3.767-.85-7.384-4.028a2.995 2.995 0 1 0-1.37 1.45c3.39 2.985 6.337 4.596 8.485 4.596a4 4 0 0 0 .548-.037 3.053 3.053 0 0 0 2.321-1.574c1.57-2.797-1.41-5.53-3.586-7.525-.293-.269-.576-.528-.836-.776-1.451-1.386-2.17-2.589-1.789-2.994.18-.192.555-.595 2.475.716.518.353 1.06.78 1.583 1.192 1.9 1.496 4.261 3.354 5.99 1.36 1.452-1.68-.247-3.758-.973-4.644a9.342 9.342 0 0 1-.213-.266l-.237-.314c-.537-.704-1.796-2.351-1.228-2.939.568-.583 2.432.477 3.51 1.436a1 1 0 0 0 1.332-1.49z"/></svg>';
    html = html + '</button>';
    html = html + '<div class="post-menu-container">';
    html = html + '<button class="post-icon-btn post-menu-btn">';
    html = html + '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/></svg>';
    html = html + '</button>';
    html = html + '<div class="post-menu-dropdown">';
    html = html + '<button class="post-menu-item"><span>Add to feed</span></button>';
    html = html + '<button class="post-menu-item"><span>Save</span></button>';
    html = html + '<button class="post-menu-item"><span>Not interested</span></button>';
    html = html + '<button class="post-menu-item"><span>Mute</span></button>';
    html = html + '<button class="post-menu-item"><span>Restrict</span></button>';
    html = html + '<button class="post-menu-item danger"><span>Block</span></button>';
    html = html + '<button class="post-menu-item danger"><span>Report</span></button>';
    html = html + '<button class="post-menu-item"><span>Copy link</span></button>';
    html = html + '</div>';
    html = html + '</div>';
    html = html + '</div>';
    html = html + '</div>';
    html = html + textHtml;
    html = html + quoteHtml;
    html = html + imageHtml;
    html = html + '<div class="post-actions">';
    html = html + '<button class="action-btn like-btn' + likedClass + '" data-id="' + post.id + '">';
    html = html + '<img src="icons/heart.svg" alt="Like">';
    html = html + likesHtml;
    html = html + '</button>';
    html = html + '<button class="action-btn comment-btn" data-id="' + post.id + '">';
    html = html + '<img src="icons/comment.svg" alt="Comment">';
    html = html + repliesHtml;
    html = html + '</button>';
    html = html + '<button class="action-btn repost-btn" data-id="' + post.id + '">';
    html = html + '<img src="icons/repost.svg" alt="Repost">';
    html = html + repostsHtml;
    html = html + '</button>';
    html = html + '<button class="action-btn share-btn" data-id="' + post.id + '">';
    html = html + '<img src="icons/share.svg" alt="Share">';
    html = html + sharesHtml;
    html = html + '</button>';
    html = html + '</div>';
    html = html + '</div>';

    div.innerHTML = html;

    // add like button click
    let likeBtn = div.querySelector('.like-btn');
    if (likeBtn != null) {
        likeBtn.onclick = function() {
            toggleLike(post.id);
        };
    }

    // add markup button click
    let markupBtn = div.querySelector('.post-markup-btn');
    if (markupBtn != null) {
        markupBtn.onclick = function() {
            showMarkupToast(post.username);
        };
    }

    // add menu button click
    let postMenuBtn = div.querySelector('.post-menu-btn');
    let postMenuDropdown = div.querySelector('.post-menu-dropdown');
    if (postMenuBtn != null && postMenuDropdown != null) {
        postMenuBtn.onclick = function(e) {
            e.stopPropagation();
            let isOpen = postMenuDropdown.classList.contains('active');
            // close all dropdowns
            let allDropdowns = document.querySelectorAll('.post-menu-dropdown.active');
            for (let i = 0; i < allDropdowns.length; i++) {
                allDropdowns[i].classList.remove('active');
            }
            if (isOpen == false) {
                postMenuDropdown.classList.add('active');
            }
        };
    }

    return div;
}

// toggle like
function toggleLike(postId) {
    console.log("toggling like for: " + postId);
    for (let i = 0; i < feedPosts.length; i++) {
        if (feedPosts[i].id == postId) {
            if (feedPosts[i].liked == true) {
                feedPosts[i].liked = false;
                feedPosts[i].likes = feedPosts[i].likes - 1;
            } else {
                feedPosts[i].liked = true;
                feedPosts[i].likes = feedPosts[i].likes + 1;
            }
            break;
        }
    }
    saveToStorage('threads_posts', feedPosts);
    renderFeed();
}

// create post
function createPost(text, image) {
    if (currentUser == null) {
        return;
    }
    if (text.trim() == '') {
        return;
    }
    // check rate limit
    let rateCheck = postRateLimiter.check();
    if (!rateCheck.allowed) {
        alert(rateCheck.message);
        return;
    }
    // trim text if too long
    text = text.substring(0, 2200);
    console.log("creating post");
    showPostToast('posting');

    setTimeout(function() {
        let newPost = {
            id: nextId++,
            username: currentUser.username,
            name: currentUser.name,
            avatar: currentUser.avatar,
            verified: false,
            text: text.trim(),
            image: image,
            time: "now",
            likes: 0,
            replies: 0,
            reposts: 0,
            shares: 0,
            liked: false
        };

        // save to user posts
        let userPosts = loadFromStorage('threads_user_posts');
        if (userPosts == null) {
            userPosts = [];
        }
        userPosts.unshift(newPost);
        saveToStorage('threads_user_posts', userPosts);

        // add to feed
        feedPosts.unshift(newPost);
        renderFeed();
        window.scrollTo(0, 0);

        showPostToast('posted');

        setTimeout(function() {
            hidePostToast();
        }, 3000);
    }, 1500);
}

// show pending post
function showPendingPost() {
    let pendingPost = loadFromStorage('threads_pending_post');
    if (pendingPost != null) {
        feedPosts.unshift(pendingPost);
        localStorage.removeItem('threads_pending_post');
        renderFeed();
        window.scrollTo(0, 0);
    }
    hidePostToast();
}

// show post toast
function showPostToast(state) {
    let toast = document.getElementById('postToast');
    let posting = document.getElementById('toastPosting');
    let posted = document.getElementById('toastPosted');
    if (toast == null) {
        return;
    }
    if (state == 'posting') {
        posting.style.display = 'flex';
        posted.style.display = 'none';
    } else {
        posting.style.display = 'none';
        posted.style.display = 'flex';
    }
    toast.classList.add('active');
}

// hide post toast
function hidePostToast() {
    let toast = document.getElementById('postToast');
    if (toast != null) {
        toast.classList.remove('active');
    }
}

// show markup toast
function showMarkupToast(username) {
    let toast = document.getElementById('markupToast');
    let toastText = document.getElementById('markupToastText');
    if (toast != null && toastText != null) {
        toastText.textContent = 'Markup by ' + username + '.';
        toast.classList.add('active');
        setTimeout(function() {
            toast.classList.remove('active');
        }, 3000);
    }
}

// open modal
function openModal() {
    let modal = document.getElementById('modalOverlay');
    if (modal != null) {
        modal.classList.add('active');
        let avatar = document.getElementById('createPostAvatar');
        let username = document.getElementById('createPostUsername');
        let addThreadAvatar = document.getElementById('addThreadAvatar');
        if (avatar != null && currentUser != null) {
            avatar.src = currentUser.avatar;
        }
        if (username != null && currentUser != null) {
            username.textContent = currentUser.username;
        }
        if (addThreadAvatar != null && currentUser != null) {
            addThreadAvatar.src = currentUser.avatar;
        }
        let textarea = document.getElementById('createPostText');
        if (textarea != null) {
            textarea.focus();
        }
    }
}

// close modal
function closeModal() {
    let modal = document.getElementById('modalOverlay');
    if (modal != null) {
        modal.classList.remove('active');
        modal.classList.remove('from-fab');
    }
    // show fab again
    let fab = document.getElementById('fab');
    if (fab != null) { fab.style.display = ''; }
    // reset drafts view back to create post
    let draftsView = document.getElementById('draftsView');
    let createPostForm = document.getElementById('createPostForm');
    if (draftsView != null) { draftsView.style.display = 'none'; }
    if (createPostForm != null) { createPostForm.style.display = ''; }
}

// get search suggestions
function getSearchSuggestions() {
    return [
        { id: 101, username: 'womenqu0tes', name: 'Women Quotes', followers: '120K followers', avatar: 'images/avatar1.jpg', verified: false },
        { id: 102, username: 'druwmelo', name: 'Andrew Melo', followers: '15.2K followers', avatar: 'images/avatar2.jpg', verified: true },
        { id: 103, username: 'techvibes', name: 'Tech Vibes', followers: '89.4K followers', avatar: 'images/avatar3.jpg', verified: true },
        { id: 104, username: 'fitnessgroup', name: 'Fitness Group', followers: '234K followers', avatar: 'images/avatar4.jpg', verified: false },
        { id: 105, username: 'artdaily', name: 'Art Daily', followers: '567K followers', avatar: 'images/avatar5.jpg', verified: true },
        { id: 106, username: 'coffeedelife', name: 'Coffee De Life', followers: '45.8K followers', avatar: 'images/avatar1.jpg', verified: false },
        { id: 107, username: 'travelnow', name: 'Travel Now', followers: '892K followers', avatar: 'images/avatar2.jpg', verified: true },
        { id: 108, username: 'musicvibes', name: 'Music Vibes', followers: '156K followers', avatar: 'images/avatar3.jpg', verified: false }
    ];
}

// render search suggestions
function renderSearchSuggestions() {
    let container = document.getElementById('searchSuggestionsList');
    if (container == null) {
        return;
    }
    container.innerHTML = '';
    let suggestions = getSearchSuggestions();

    for (let i = 0; i < suggestions.length; i++) {
        let user = suggestions[i];
        let userEl = document.createElement('div');
        userEl.className = 'search-suggestion-item';

        // build verified html
        let verifiedHtml = '';
        if (user.verified == true) {
            verifiedHtml = '<svg class="verified-badge" width="12" height="12" viewBox="0 0 24 24" fill="#0095F6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
        }

        let html = '';
        html = html + '<img src="' + user.avatar + '" alt="' + user.username + '" class="search-suggestion-avatar">';
        html = html + '<div class="search-suggestion-info">';
        html = html + '<div class="search-suggestion-username">';
        html = html + '<span>' + user.username + '</span>';
        html = html + verifiedHtml;
        html = html + '</div>';
        html = html + '<span class="search-suggestion-name">' + user.name + '</span>';
        html = html + '<span class="search-suggestion-followers">' + user.followers + '</span>';
        html = html + '</div>';
        html = html + '<button class="search-suggestion-follow-btn">Follow</button>';

        userEl.innerHTML = html;

        // add follow button click
        let followBtn = userEl.querySelector('.search-suggestion-follow-btn');
        followBtn.onclick = function(e) {
            e.stopPropagation();
            if (this.classList.contains('following')) {
                this.classList.remove('following');
                this.textContent = 'Follow';
            } else {
                this.classList.add('following');
                this.textContent = 'Following';
            }
        };

        container.appendChild(userEl);
    }
}

// create suggested section html
function createSuggestedSection() {
    let html = '<div class="suggested-section" id="suggestedSection">';
    html = html + '<h3 class="suggested-title">Suggested for you</h3>';
    html = html + '<div class="suggested-users-wrapper">';
    html = html + '<div class="suggested-users" id="suggestedUsers"></div>';
    html = html + '</div>';
    html = html + '</div>';
    return html;
}

// create ghost empty state
function createGhostEmptyState() {
    let html = '<div class="ghost-empty-state" id="ghostEmptyState">';
    html = html + '<div class="ghost-icon">';
    html = html + '<svg width="80" height="80" viewBox="0 0 20 19" fill="currentColor">';
    html = html + '<path d="M4.60249 16.4045C4.86284 16.0252 5.38193 15.9287 5.76134 16.1888C6.1495 16.4552 6.56424 16.6861 6.99995 16.8765C7.4757 17.0843 7.97782 17.2443 8.49897 17.3501C8.94984 17.4417 9.24062 17.8823 9.1492 18.3332C9.0575 18.784 8.61788 19.0757 8.16694 18.9842C7.52911 18.8547 6.9149 18.6584 6.33263 18.404C5.79943 18.171 5.29237 17.8888 4.81814 17.5633C4.43901 17.3028 4.34214 16.7838 4.60249 16.4045Z"></path>';
    html = html + '<path d="M14.2379 16.1888C14.6172 15.9285 15.1362 16.0253 15.3968 16.4045C15.6572 16.7839 15.5606 17.3029 15.1811 17.5633C14.7068 17.8888 14.1999 18.171 13.6666 18.404C13.0843 18.6584 12.4702 18.8547 11.8323 18.9842C11.3814 19.0756 10.9408 18.784 10.8492 18.3332C10.7579 17.8824 11.0496 17.4418 11.5003 17.3501C12.0215 17.2443 12.5235 17.0843 12.9993 16.8765C13.4351 16.686 13.8497 16.4553 14.2379 16.1888Z"></path>';
    html = html + '<path d="M1.6671 10.8503C2.11797 10.7587 2.55758 11.0506 2.64936 11.5013C2.75515 12.0225 2.91515 12.5246 3.12299 13.0003C3.31653 13.4433 3.55247 13.8647 3.82449 14.2585C4.08586 14.6371 3.99064 15.1558 3.61209 15.4173C3.23352 15.6786 2.71482 15.5841 2.45323 15.2057C2.12096 14.7248 1.83313 14.2096 1.5963 13.6676C1.34194 13.0854 1.14555 12.4711 1.01606 11.8333C0.924746 11.3825 1.21638 10.942 1.6671 10.8503Z"></path>';
    html = html + '<path d="M9.99962 0.833984C15.0621 0.833995 19.1661 4.93817 19.1663 10.0007C19.1663 10.6273 19.1035 11.2407 18.9832 11.8333C18.8537 12.4712 18.6574 13.0853 18.4029 13.6676C18.1661 14.2098 17.8784 14.7247 17.546 15.2057C17.2844 15.5842 16.7657 15.6787 16.3872 15.4173C16.0089 15.1557 15.9135 14.637 16.1748 14.2585C16.4469 13.8646 16.6827 13.4434 16.8762 13.0003C17.0841 12.5245 17.2441 12.0226 17.3499 11.5013C17.4481 11.0172 17.4996 10.5153 17.4996 10.0007C17.4995 5.85864 14.1417 2.50066 9.99962 2.50065C8.8214 2.50071 7.70832 2.77171 6.71837 3.25423L6.5963 3.30225C6.4708 3.34043 6.33684 3.34834 6.20649 3.32503L2.70307 2.69922L3.33865 6.17334C3.3709 6.34936 3.34609 6.53119 3.26704 6.69173C2.93406 7.3678 2.69972 8.10131 2.58344 8.87354C2.51495 9.32865 2.09048 9.64271 1.63536 9.57422C1.18062 9.50551 0.867211 9.08097 0.935494 8.62614C1.06319 7.77778 1.30818 6.96719 1.65164 6.21159L0.846789 1.81706C0.797783 1.54853 0.882883 1.27241 1.07547 1.07894C1.26812 0.885461 1.54399 0.799138 1.81277 0.847005L6.24148 1.63883C7.38929 1.12218 8.66189 0.834039 9.99962 0.833984Z"></path>';
    html = html + '<path d="M13.1572 10.974C13.4826 10.6486 14.0101 10.6485 14.3356 10.974C14.6608 11.2994 14.6609 11.8269 14.3356 12.1523C13.7273 12.7606 12.87 13.0214 12.0797 13.0215C11.2894 13.0215 10.4321 12.7606 9.82384 12.1523C9.4984 11.8269 9.4984 11.2994 9.82384 10.974C10.1493 10.6486 10.6768 10.6485 11.0022 10.974C11.2273 11.1989 11.6202 11.3548 12.0797 11.3548C12.5392 11.3548 12.9322 11.1989 13.1572 10.974Z"></path>';
    html = html + '<path d="M14.7913 7.81966C15.3664 7.82039 15.8318 8.28705 15.8313 8.86214C15.8306 9.43723 15.364 9.90285 14.7888 9.90218C14.2137 9.9016 13.7482 9.43482 13.7488 8.8597C13.7494 8.28458 14.2162 7.8191 14.7913 7.81966Z"></path>';
    html = html + '<path d="M9.37543 7.81315C9.95079 7.81371 10.4169 8.28038 10.4163 8.85563C10.4157 9.43071 9.94895 9.89624 9.37381 9.89567C8.79875 9.89509 8.33245 9.42827 8.33295 8.85319C8.33372 8.27828 8.80075 7.81275 9.37543 7.81315Z"></path>';
    html = html + '</svg>';
    html = html + '</div>';
    html = html + '<h2 class="ghost-title">No ghost posts yet</h2>';
    html = html + '<p class="ghost-description">Ghost posts are archived after 24 hours. Replies go to messages, and only you can see who liked and replied.</p>';
    html = html + '</div>';
    return html;
}

// init suggested cards
function initSuggestedCards() {
    let container = document.getElementById('suggestedUsers');
    if (container == null) {
        return;
    }

    let users = [
        { name: 'Sergo Chivadze', username: 'sergo_chivadze', avatar: 'images/avatar1.jpg', verified: false },
        { name: 'Dr. Giorgi', username: 'dr.samkharadze', avatar: 'images/avatar2.jpg', verified: false },
        { name: 'nickc_arter', username: 'nickc_arter7389', avatar: 'images/avatar3.jpg', verified: false },
        { name: 'lauraclery', username: 'lauraclery', avatar: 'images/avatar4.jpg', verified: true },
        { name: 'techguru', username: 'techguru', avatar: 'images/avatar5.jpg', verified: false }
    ];

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let verifiedBadge = '';
        if (user.verified == true) {
            verifiedBadge = '<svg class="verified-badge" width="14" height="14" viewBox="0 0 24 24" fill="#0095F6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
        }

        let card = document.createElement('div');
        card.className = 'suggested-user-card';
        let html = '';
        html = html + '<button class="suggested-close-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        html = html + '<img src="' + user.avatar + '" class="suggested-avatar">';
        html = html + '<div class="suggested-name">' + user.name + verifiedBadge + '</div>';
        html = html + '<div class="suggested-username">' + user.username + '</div>';
        html = html + '<button class="suggested-follow-btn">Follow</button>';
        card.innerHTML = html;

        // add close button click
        card.querySelector('.suggested-close-btn').onclick = function(e) {
            e.stopPropagation();
            card.remove();
        };

        container.appendChild(card);
    }
}

// init function
function init() {
    console.log("init starting");

    // check if logged in
    let isLoggedIn = localStorage.getItem('threads_is_logged_in');
    if (isLoggedIn != 'true') {
        console.log("not logged in");
        window.location.href = 'login.html';
        return;
    }

    currentUser = loadFromStorage('threads_user');

    // set user avatar in composer
    let composerAvatar = document.getElementById('composerAvatar');
    if (composerAvatar != null && currentUser != null) {
        composerAvatar.src = currentUser.avatar;
    }

    // load posts
    let samplePosts = getSamplePosts();
    let userPosts = loadFromStorage('threads_user_posts');
    if (userPosts == null) {
        userPosts = [];
    }
    feedPosts = [];
    for (let i = 0; i < userPosts.length; i++) {
        feedPosts.push(userPosts[i]);
    }
    for (let i = 0; i < samplePosts.length; i++) {
        feedPosts.push(samplePosts[i]);
    }

    renderFeed();

    // close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        // check if click was outside the menu container
        if (e.target.closest('.post-menu-container') == null) {
            let allDropdowns = document.querySelectorAll('.post-menu-dropdown.active');
            for (let i = 0; i < allDropdowns.length; i++) {
                allDropdowns[i].classList.remove('active');
            }
        }
    });

    // composer click
    let composer = document.getElementById('composer');
    if (composer != null) {
        composer.onclick = function() {
            let modal = document.getElementById('modalOverlay');
            if (modal != null) {
                modal.classList.remove('from-fab');
            }
            openModal();
        };
    }

    // fab click
    let fab = document.getElementById('fab');
    if (fab != null) {
        fab.onclick = function() {
            let modal = document.getElementById('modalOverlay');
            if (modal != null) {
                modal.classList.add('from-fab');
            }
            fab.style.display = 'none';
            openModal();
        };
    }

    // modal close
    let createPostClose = document.getElementById('createPostClose');
    if (createPostClose != null) {
        createPostClose.onclick = function() {
            closeModal();
            document.getElementById('createPostText').value = '';
            document.getElementById('createPostImagePreview').style.display = 'none';
        };
    }

    // modal overlay click
    let modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay != null) {
        modalOverlay.onclick = function(e) {
            if (e.target == modalOverlay) {
                closeModal();
            }
        };
    }

    // modal submit
    let createPostSubmit = document.getElementById('createPostSubmit');
    if (createPostSubmit != null) {
        createPostSubmit.onclick = function() {
            let textarea = document.getElementById('createPostText');
            let previewImg = document.getElementById('createPostPreviewImg');
            let text = textarea.value.trim();
            let image = null;
            if (previewImg != null && previewImg.src) {
                image = previewImg.src;
            }
            if (text != '') {
                createPost(text, image);
                closeModal();
                textarea.value = '';
                document.getElementById('createPostImagePreview').style.display = 'none';
                if (previewImg != null) {
                    previewImg.src = '';
                }
            }
        };
    }

    // image upload
    let createPostImage = document.getElementById('createPostImage');
    if (createPostImage != null) {
        createPostImage.onchange = function(e) {
            let file = e.target.files[0];
            if (file != null) {
                let reader = new FileReader();
                reader.onload = function(ev) {
                    document.getElementById('createPostPreviewImg').src = ev.target.result;
                    document.getElementById('createPostImagePreview').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };
    }

    // remove image
    let removeImageBtn = document.getElementById('removeImageBtn');
    if (removeImageBtn != null) {
        removeImageBtn.onclick = function() {
            document.getElementById('createPostImagePreview').style.display = 'none';
            document.getElementById('createPostPreviewImg').src = '';
            document.getElementById('createPostImage').value = '';
        };
    }

    // textarea input
    let createPostText = document.getElementById('createPostText');
    let postBtn = document.getElementById('createPostSubmit');
    let addThreadText = document.querySelector('.add-thread-text');
    let addThreadAvatar = document.getElementById('addThreadAvatar');

    if (createPostText != null && postBtn != null) {
        createPostText.addEventListener('input', function() {
            if (this.value.trim() != '') {
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

    // feed tabs
    let feedTabs = document.querySelectorAll('.feed-tab');
    let feed = document.getElementById('feed');

    for (let i = 0; i < feedTabs.length; i++) {
        feedTabs[i].onclick = function() {
            // remove active from all
            for (let j = 0; j < feedTabs.length; j++) {
                feedTabs[j].classList.remove('active');
            }
            this.classList.add('active');

            let feedType = this.dataset.feed;
            let existingSuggested = document.getElementById('suggestedSection');
            let existingGhostEmpty = document.getElementById('ghostEmptyState');
            let composerEl = document.getElementById('composer');
            let sideActionEl = document.querySelector('.side-action-container');

            if (feedType == 'following') {
                if (feed != null) { feed.style.display = 'flex'; }
                if (composerEl != null) { composerEl.style.display = 'flex'; }
                if (sideActionEl != null) { sideActionEl.style.display = ''; }
                if (existingGhostEmpty != null) { existingGhostEmpty.remove(); }
                if (existingSuggested != null) { existingSuggested.remove(); }
                // load following posts
                feedPosts = getFollowingPosts();
                renderFeed();
                // add suggested section after 2nd post
                let postEls = feed.querySelectorAll('.post');
                if (postEls.length >= 2) {
                    let suggestedHTML = createSuggestedSection();
                    // add html after this element
                    postEls[1].insertAdjacentHTML('afterend', suggestedHTML);
                    initSuggestedCards();
                }
            } else if (feedType == 'ghost') {
                if (feed != null) { feed.style.display = 'none'; }
                if (composerEl != null) { composerEl.style.display = 'none'; }
                if (sideActionEl != null) { sideActionEl.style.display = 'none'; }
                if (existingSuggested != null) { existingSuggested.remove(); }
                if (existingGhostEmpty == null) {
                    let feedContainer = document.querySelector('.feed-container');
                    if (feedContainer != null) {
                        // add html at the end of the container
                        feedContainer.insertAdjacentHTML('beforeend', createGhostEmptyState());
                    }
                }
            } else {
                // for you tab - load sample posts
                if (feed != null) { feed.style.display = 'flex'; }
                if (composerEl != null) { composerEl.style.display = 'flex'; }
                if (sideActionEl != null) { sideActionEl.style.display = ''; }
                if (existingSuggested != null) { existingSuggested.remove(); }
                if (existingGhostEmpty != null) { existingGhostEmpty.remove(); }
                feedPosts = getSamplePosts();
                renderFeed();
            }
        };
    }

    // feed more dropdown
    let feedMoreBtn = document.getElementById('feedMoreBtn');
    let feedMoreDropdown = document.getElementById('feedMoreDropdown');
    if (feedMoreBtn != null && feedMoreDropdown != null) {
        feedMoreBtn.onclick = function(e) {
            e.stopPropagation();
            // build dropdown based on active tab
            let activeTab = document.querySelector('.feed-tab.active');
            let activeFeed = 'foryou';
            if (activeTab) {
                activeFeed = activeTab.dataset.feed;
            }
            let addColumnHtml = '';
            addColumnHtml = addColumnHtml + '<button class="feed-more-item">';
            addColumnHtml = addColumnHtml + '<span>Add as column</span>';
            addColumnHtml = addColumnHtml + '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">';
            addColumnHtml = addColumnHtml + '<path d="M3 2C2.58579 2 2.25 2.33579 2.25 2.75V4.25H0.75C0.335786 4.25 0 4.58579 0 5C0 5.41421 0.335786 5.75 0.75 5.75H2.25V7.25C2.25 7.66421 2.58579 8 3 8C3.41421 8 3.75 7.66421 3.75 7.25V5.75H5.25C5.66421 5.75 6 5.41421 6 5C6 4.58579 5.66421 4.25 5.25 4.25H3.75V2.75C3.75 2.33579 3.41421 2 3 2Z"></path>';
            addColumnHtml = addColumnHtml + '<path clip-rule="evenodd" d="M7.25 3.75H16C17.5188 3.75 18.75 4.98122 18.75 6.5V14.5C18.75 16.0188 17.5188 17.25 16 17.25H5C3.48122 17.25 2.25 16.0188 2.25 14.5V9.5H3.75V14.5C3.75 15.1904 4.30964 15.75 5 15.75H7.25V3.75ZM8.75 15.75V5.25H12.25V15.75H8.75ZM13.75 15.75H16C16.6904 15.75 17.25 15.1904 17.25 14.5V6.5C17.25 5.80964 16.6904 5.25 16 5.25H13.75V15.75Z" fill-rule="evenodd"></path>';
            addColumnHtml = addColumnHtml + '</svg>';
            addColumnHtml = addColumnHtml + '</button>';

            let createFeedHtml = '';
            createFeedHtml = createFeedHtml + '<button class="feed-more-item">';
            createFeedHtml = createFeedHtml + '<span>Create new feed</span>';
            createFeedHtml = createFeedHtml + '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">';
            createFeedHtml = createFeedHtml + '<circle cx="10" cy="10" r="7.5"/>';
            createFeedHtml = createFeedHtml + '<line x1="10" y1="6.5" x2="10" y2="13.5"/>';
            createFeedHtml = createFeedHtml + '<line x1="6.5" y1="10" x2="13.5" y2="10"/>';
            createFeedHtml = createFeedHtml + '</svg>';
            createFeedHtml = createFeedHtml + '</button>';

            let html = '';
            if (activeFeed == 'foryou') {
                html = createFeedHtml;
            } else if (activeFeed == 'ghost') {
                html = addColumnHtml;
            } else {
                // following tab
                html = addColumnHtml + '<div class="feed-more-divider"></div>' + createFeedHtml;
            }
            feedMoreDropdown.innerHTML = html;
            if (feedMoreDropdown.classList.contains('active')) {
                feedMoreDropdown.classList.remove('active');
            } else {
                feedMoreDropdown.classList.add('active');
            }
        };
        document.addEventListener('click', function(e) {
            if (feedMoreDropdown.contains(e.target) == false && feedMoreBtn.contains(e.target) == false) {
                feedMoreDropdown.classList.remove('active');
            }
        });
    }

    // side action button (add a column)
    let sideActionBtn = document.getElementById('sideActionBtn');
    let sideActionDropdown = document.getElementById('sideActionDropdown');
    let sideActionMainMenu = document.getElementById('sideActionMainMenu');
    let sideActionFeedsMenu = document.getElementById('sideActionFeedsMenu');
    let feedsMenuBtn = document.getElementById('feedsMenuBtn');
    let feedsBackBtn = document.getElementById('feedsBackBtn');

    if (sideActionBtn != null && sideActionDropdown != null) {
        sideActionBtn.onclick = function(e) {
            e.stopPropagation();
            // reset to main menu
            if (sideActionMainMenu != null) { sideActionMainMenu.style.display = 'block'; }
            if (sideActionFeedsMenu != null) { sideActionFeedsMenu.classList.remove('active'); }
            if (sideActionDropdown.classList.contains('active')) {
                sideActionDropdown.classList.remove('active');
            } else {
                sideActionDropdown.classList.add('active');
            }
        };

        // feeds submenu
        if (feedsMenuBtn != null) {
            feedsMenuBtn.onclick = function(e) {
                e.stopPropagation();
                if (sideActionMainMenu != null) { sideActionMainMenu.style.display = 'none'; }
                if (sideActionFeedsMenu != null) { sideActionFeedsMenu.classList.add('active'); }
            };
        }

        // feeds back button
        if (feedsBackBtn != null) {
            feedsBackBtn.onclick = function(e) {
                e.stopPropagation();
                if (sideActionFeedsMenu != null) { sideActionFeedsMenu.classList.remove('active'); }
                if (sideActionMainMenu != null) { sideActionMainMenu.style.display = 'block'; }
            };
        }

        // close when clicking outside
        document.addEventListener('click', function(e) {
            if (sideActionDropdown.contains(e.target) == false && sideActionBtn.contains(e.target) == false) {
                sideActionDropdown.classList.remove('active');
            }
        });
    }

    // search modal
    let searchModalOverlay = document.getElementById('searchModalOverlay');
    if (searchModalOverlay != null) {
        searchModalOverlay.onclick = function(e) {
            if (e.target == searchModalOverlay) {
                searchModalOverlay.classList.remove('active');
            }
        };
    }

    // search filter dropdown
    let searchFilterBtn = document.getElementById('searchFilterBtn');
    let searchFilterDropdown = document.getElementById('searchFilterDropdown');
    let searchChips = document.getElementById('searchChips');

    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let fullMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    // format a date like "2 Feb 2026"
    function formatDate(date) {
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }

    // add a search chip
    function addSearchChip(type, value) {
        if (searchChips == null) return;
        // dont add duplicate type
        let existing = searchChips.querySelector('[data-type="' + type + '"]');
        if (existing != null) existing.remove();

        let chip = document.createElement('div');
        chip.className = 'search-chip';
        chip.dataset.type = type;

        let label = 'From';
        if (type == 'after') {
            label = 'After';
        } else if (type == 'before') {
            label = 'Before';
        }

        if (type == 'profile') {
            chip.innerHTML = '<span class="search-chip-label">' + label + '</span>' +
                '<input class="search-chip-input" type="text" placeholder="Profile" value="">' +
                '<button class="search-chip-remove"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        } else {
            chip.innerHTML = '<span class="search-chip-label">' + label + '</span>' +
                '<span class="search-chip-value">' + sanitize(value) + '</span>' +
                '<button class="search-chip-remove"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
        }

        chip.querySelector('.search-chip-remove').onclick = function(e) {
            e.stopPropagation();
            chip.remove();
            if (calendarPicker != null) calendarPicker.classList.remove('active');
        };

        // click chip to open calendar (only for after/before)
        if (type == 'after' || type == 'before') {
            chip.onclick = function(e) {
                if (e.target.closest('.search-chip-remove')) return;
                e.stopPropagation();
                showCalendar(type);
            };
        }

        // click profile chip to focus input inside it
        if (type == 'profile') {
            chip.onclick = function(e) {
                if (e.target.closest('.search-chip-remove')) return;
                e.stopPropagation();
                let inp = chip.querySelector('.search-chip-input');
                if (inp != null) inp.focus();
            };
        }

        searchChips.appendChild(chip);
    }

    // calendar picker
    let calendarPicker = document.getElementById('searchCalendarPicker');
    let calendarGrid = document.getElementById('calendarGrid');
    let calendarMonthYear = document.getElementById('calendarMonthYear');
    let calendarPrev = document.getElementById('calendarPrev');
    let calendarNext = document.getElementById('calendarNext');
    let calendarCurrentMonth = new Date().getMonth();
    let calendarCurrentYear = new Date().getFullYear();
    let calendarFilterType = null;

    function renderCalendar() {
        if (calendarGrid == null || calendarMonthYear == null) return;
        calendarMonthYear.textContent = fullMonths[calendarCurrentMonth] + ' ' + calendarCurrentYear;
        calendarGrid.innerHTML = '';

        let firstDay = new Date(calendarCurrentYear, calendarCurrentMonth, 1).getDay();
        let daysInMonth = new Date(calendarCurrentYear, calendarCurrentMonth + 1, 0).getDate();
        let today = new Date();

        // empty cells before 1st
        for (let i = 0; i < firstDay; i++) {
            let empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            calendarGrid.appendChild(empty);
        }

        // day buttons
        for (let d = 1; d <= daysInMonth; d++) {
            let btn = document.createElement('button');
            btn.className = 'calendar-day';
            btn.textContent = d;
            if (d == today.getDate() && calendarCurrentMonth == today.getMonth() && calendarCurrentYear == today.getFullYear()) {
                btn.classList.add('today');
            }
            btn.dataset.day = d;
            btn.onclick = function() {
                let picked = new Date(calendarCurrentYear, calendarCurrentMonth, parseInt(this.dataset.day));
                addSearchChip(calendarFilterType, formatDate(picked));
                calendarPicker.classList.remove('active');
            };
            calendarGrid.appendChild(btn);
        }
    }

    if (calendarPrev != null) {
        calendarPrev.onclick = function(e) {
            e.stopPropagation();
            calendarCurrentMonth--;
            if (calendarCurrentMonth < 0) { calendarCurrentMonth = 11; calendarCurrentYear--; }
            renderCalendar();
        };
    }
    if (calendarNext != null) {
        calendarNext.onclick = function(e) {
            e.stopPropagation();
            calendarCurrentMonth++;
            if (calendarCurrentMonth > 11) { calendarCurrentMonth = 0; calendarCurrentYear++; }
            renderCalendar();
        };
    }

    function showCalendar(type) {
        // toggle off if same type already open
        if (calendarPicker.classList.contains('active') && calendarFilterType == type) {
            calendarPicker.classList.remove('active');
            return;
        }
        calendarFilterType = type;
        calendarCurrentMonth = new Date().getMonth();
        calendarCurrentYear = new Date().getFullYear();
        renderCalendar();
        calendarPicker.classList.add('active');
    }

    if (searchFilterBtn != null && searchFilterDropdown != null) {
        searchFilterBtn.onclick = function(e) {
            e.stopPropagation();
            if (searchFilterDropdown.classList.contains('active')) {
                searchFilterDropdown.classList.remove('active');
            } else {
                searchFilterDropdown.classList.add('active');
            }
            if (calendarPicker != null) calendarPicker.classList.remove('active');
        };

        // filter item clicks
        let filterItems = searchFilterDropdown.querySelectorAll('.search-filter-item');
        // after date - adds chip with todays date
        if (filterItems[0] != null) {
            filterItems[0].onclick = function(e) {
                e.stopPropagation();
                searchFilterDropdown.classList.remove('active');
                addSearchChip('after', formatDate(new Date()));
            };
        }
        // before date - adds chip with todays date
        if (filterItems[1] != null) {
            filterItems[1].onclick = function(e) {
                e.stopPropagation();
                searchFilterDropdown.classList.remove('active');
                addSearchChip('before', formatDate(new Date()));
            };
        }
        // from profile - adds chip inside search input wrapper like others
        if (filterItems[2] != null) {
            filterItems[2].onclick = function(e) {
                e.stopPropagation();
                searchFilterDropdown.classList.remove('active');
                addSearchChip('profile', 'Profile');
                let searchInput = document.getElementById('searchInput');
                if (searchInput != null) searchInput.focus();
            };
        }

        document.addEventListener('click', function(e) {
            if (searchFilterDropdown.contains(e.target) == false && searchFilterBtn.contains(e.target) == false) {
                searchFilterDropdown.classList.remove('active');
            }
            if (calendarPicker != null && calendarPicker.contains(e.target) == false && searchFilterDropdown.contains(e.target) == false && searchFilterBtn.contains(e.target) == false && (searchChips == null || searchChips.contains(e.target) == false)) {
                calendarPicker.classList.remove('active');
            }
        });
    }

    // logo click - refresh feed when on for you tab
    let logoLink = document.querySelector('.logo-link');
    if (logoLink != null) {
        logoLink.onclick = function(e) {
            e.preventDefault();
            // if search modal is open, close it and go home
            let searchOverlay = document.getElementById('searchModalOverlay');
            if (searchOverlay != null && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                window.location.href = 'home.html';
                return;
            }
            let activeTab = document.querySelector('.feed-tab.active');
            let activeFeed = 'foryou';
            if (activeTab) {
                activeFeed = activeTab.dataset.feed;
            }
            if (activeFeed == 'foryou') {
                window.scrollTo(0, 0);
                let updateBar = document.getElementById('feedUpdateBar');
                if (updateBar != null) {
                    updateBar.classList.add('active');
                    setTimeout(function() {
                        let newPosts = getRandomPosts();
                        feedPosts = newPosts;
                        renderFeed();
                        updateBar.classList.remove('active');
                    }, 1200);
                }
            }
        };
    }

    // nav buttons
    let navBtns = document.querySelectorAll('.nav-btn[data-tab]');
    for (let i = 0; i < navBtns.length; i++) {
        navBtns[i].addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            let tab = this.getAttribute('data-tab');
            console.log("nav clicked: " + tab);
            if (tab == 'profile') {
                window.location.href = 'profile.html';
            }
            if (tab == 'activity') {
                window.location.href = 'activity.html';
            }
            if (tab == 'search') {
                if (searchModalOverlay != null) {
                    renderSearchSuggestions();
                    searchModalOverlay.classList.add('active');
                }
            }
            if (tab == 'create') {
                // close calendar and filter dropdown
                if (calendarPicker != null) calendarPicker.classList.remove('active');
                if (searchFilterDropdown != null) searchFilterDropdown.classList.remove('active');
                // keep search modal open underneath
                openModal();
            }
            if (tab == 'home') {
                window.scrollTo(0, 0);
                // show update bar
                let updateBar = document.getElementById('feedUpdateBar');
                if (updateBar != null) {
                    updateBar.classList.add('active');
                    // load new random posts
                    setTimeout(function() {
                        let newPosts = getRandomPosts();
                        feedPosts = newPosts;
                        renderFeed();
                        updateBar.classList.remove('active');
                    }, 1200);
                }
            }
        });
    }

    // more menu dropdown (create post header)
    let moreMenuBtn = document.getElementById('moreMenuBtn');
    let moreMenuDropdown = document.getElementById('moreMenuDropdown');
    if (moreMenuBtn != null && moreMenuDropdown != null) {
        moreMenuBtn.onclick = function(e) {
            e.stopPropagation();
            if (moreMenuDropdown.classList.contains('active')) {
                moreMenuDropdown.classList.remove('active');
            } else {
                moreMenuDropdown.classList.add('active');
            }
        };
        document.addEventListener('click', function(e) {
            if (moreMenuDropdown.contains(e.target) == false && moreMenuBtn.contains(e.target) == false) {
                moreMenuDropdown.classList.remove('active');
            }
        });
    }

    // drafts view toggle
    let draftsBtn = document.getElementById('draftsBtn');
    let draftsView = document.getElementById('draftsView');
    let draftsBackBtn = document.getElementById('draftsBackBtn');
    let createPostForm = document.getElementById('createPostForm');
    if (draftsBtn != null && draftsView != null && createPostForm != null) {
        draftsBtn.onclick = function(e) {
            e.stopPropagation();
            createPostForm.style.display = 'none';
            draftsView.style.display = 'flex';
        };
        if (draftsBackBtn != null) {
            draftsBackBtn.onclick = function(e) {
                e.stopPropagation();
                draftsView.style.display = 'none';
                createPostForm.style.display = '';
            };
        }
    }

    // menu dropdown
    let menuBtn = document.getElementById('menuBtn');
    let menuDropdown = document.getElementById('menuDropdown');
    let logoutBtn = document.getElementById('logoutBtn');

    if (menuBtn != null && menuDropdown != null) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (menuDropdown.classList.contains('active')) {
                menuDropdown.classList.remove('active');
            } else {
                menuDropdown.classList.add('active');
            }
        });

        document.addEventListener('click', function(e) {
            if (menuDropdown.contains(e.target) == false && menuBtn.contains(e.target) == false) {
                menuDropdown.classList.remove('active');
            }
        });

        // appearance options
        let appearanceOptions = document.querySelectorAll('.appearance-option');
        for (let i = 0; i < appearanceOptions.length; i++) {
            appearanceOptions[i].onclick = function(e) {
                e.stopPropagation();
                let theme = this.getAttribute('data-theme');
                for (let j = 0; j < appearanceOptions.length; j++) {
                    appearanceOptions[j].classList.remove('active');
                }
                this.classList.add('active');
                if (theme == 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('threads_theme', JSON.stringify('light'));
                } else if (theme == 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('threads_theme', JSON.stringify('dark'));
                } else {
                    localStorage.setItem('threads_theme', JSON.stringify('auto'));
                    if (!window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        document.documentElement.setAttribute('data-theme', 'light');
                    } else {
                        document.documentElement.removeAttribute('data-theme');
                    }
                }
            };
        }

        // logout
        if (logoutBtn != null) {
            logoutBtn.onclick = function() {
                console.log("logging out");
                localStorage.removeItem('threads_is_logged_in');
                localStorage.removeItem('threads_user');
                window.location.href = 'login.html';
            };
        }
    }

    console.log("init done");
}

document.addEventListener('DOMContentLoaded', function() {
    init();
    initSessionTimeout();

    // check if coming from another page with #create hash
    if (window.location.hash == '#create') {
        openModal();
        // clean up the url
        history.replaceState(null, '', window.location.pathname);
    }
});
