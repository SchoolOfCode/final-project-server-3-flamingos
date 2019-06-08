const request = require("request-promise-native");

const timer = 25000;

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTk5OTgzMTcsImRhdGEiOnsiZGlzcGxheU5hbWUiOiJqMG5ueWwifSwiaWF0IjoxNTU4Nzg4NzE3fQ.x883E4rwwUumnDIeTdZWeVDzhab0TAFmLGn3gPxEf4I";

let dummy_posts = [
    {
        token,
        description:
            "There's some vandalism at Snow Hill Station that's delaying trains",
        longitude: "-1.897511",
        latitude: "52.482577",
        postCategory: "travel"
    },
    {
        token,
        description:
            "The railings at Calthorpe Park and damage and my children might hurt themselves",
        longitude: "-1.899936",
        latitude: "52.459154",
        postCategory: "crime"
    },
    {
        token,
        description:
            "On a building site near Morrisons in Small Heath a colleague has cut his hand badly",
        longitude: "-1.861552",
        latitude: "52.473543",
        postCategory: "emergency"
    }
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
