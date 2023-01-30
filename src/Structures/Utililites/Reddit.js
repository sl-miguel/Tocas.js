class Reddit {

    constructor() {
        this.cache = new Map();
    }

    query(params) {
        let query = Object.keys(params);
        query = query.map((key) => `${key}=${params[key]}`);
        query = query.join('&');
        return `?${query}`;
    }

    random(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    async GET(subreddit, options = {}) {

        const defaultOptions = { sort: 'top', period: 'week', limit: 100 };
        const { sort, period, limit } = { ...defaultOptions, ...options };

        const pickedSubreddit = Array.isArray(subreddit) ? this.random(subreddit) : subreddit;
        const url = `https://www.reddit.com/r/${pickedSubreddit}/${sort}.json?limit=${limit}&t=${period}`;
        const response = await fetch(url);
        return await response.json();

        // SORT:
        // hot: returns the posts that are currently popular
        // new: returns the newest posts
        // top: returns the top posts (based on the time period specified by the t parameter)
        // controversial: returns the most controversial posts (based on the time period specified by the t parameter)
        // rising: returns the rising posts (based on the time period specified by the t parameter)

        // T:
        // hour: returns the top posts for the past hour
        // day: returns the top posts for the past day
        // week: returns the top posts for the past week
        // month: returns the top posts for the past month
        // year: returns the top posts for the past year
        // all: returns the top posts of all time

        // this.cache.set(subreddit, url);
    }

    async getImage(subreddit, retry = 10, options = {}) {
        let retries = 0;
        let post = await this.GET(subreddit, options);

        while (retries < retry) {
            const hasImage = /(jpe?g|png|gif)/.test(post.url ?? '')
            if (hasImage) return post.url;
            post = await this.GET(subreddit, options);
            retries += 1;

        }

        // if (post?.is_gallery) this.gallery(post);
        return post.url.replace('gifv', 'gif');
    }
}

export default Reddit;