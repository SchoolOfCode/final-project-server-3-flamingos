const request = require("request-promise-native");

const timer = 2000;

let dummy_posts = [
    {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjE0NTU0NjQsImRhdGEiOnsiZGlzcGxheU5hbWUiOiJqMG5ueWwifSwiaWF0IjoxNTYwMjQ1ODY0fQ.QcWKLW4NzekC-3z09SSvd3c7-zQazKvnCik9o4e3iYo",
        description:
            "There's an awesome street artist near Birmingham Snow Hill",
        imageId: "eza7niusoybtergdr4hv",
        imageUrl: "https://res.cloudinary.com/soc-report/image/upload/v1560245588/demo/eza7niusoybtergdr4hv.jpg",
        longitude: "-1.897511",
        latitude: "52.482577",
        postCategory: "event"
    },
    {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjE0NTU0OTQsImRhdGEiOnsiZGlzcGxheU5hbWUiOiJzdHVwb3QifSwiaWF0IjoxNTYwMjQ1ODk0fQ.aVgk6Aii3XljsKLdT2CFoI4O5onSa7qcTCoZtYjBdow",
        description:
            "Just grabbing something to eat in the Old Moseley Arms",
        imageId: "bzbakqskfvmmuaxdgtgm",
        imageUrl: "https://res.cloudinary.com/soc-report/image/upload/v1560246014/demo/bzbakqskfvmmuaxdgtgm.jpg",
        longitude: "-1.899936",
        latitude: "52.459154",
        postCategory: "restaurant"
    },
];

const make_posts = async () => {
    let promises = dummy_posts.map(async post => {
        let sendOptions = {
            method: "post",
            body: post,
            json: true,
            url: "https://j0nn.io/function/watu-posts-add"
        };
        let body = await request.post(sendOptions);
        return { token: sendOptions.body.token, postId: body.postId };
    });

    return await Promise.all(promises);
};

let confirm_posts = async () => {
    let postIds = await make_posts();
    postIds.map(async (confirm, index) => {
        let confirmOptions = {
            method: "post",
            body: confirm,
            json: true,
            url: "https://j0nn.io/function/watu-posts-confirm"
        };
        let timeout = (index + 1) * timer;
        setTimeout(
            () =>
                request.post(confirmOptions).then(res =>
                    console.log({
                        post: res.postId,
                        confirmed: res.confirmed
                    })
                ),
            timeout
        );
    });
};

confirm_posts();
