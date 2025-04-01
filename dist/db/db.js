"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.db = {
    posts: [{
            id: "1",
            title: "Post 1",
            shortDescription: "Post about the post what is to post",
            content: "a lot of cool text",
            blogId: "372874927",
            blogName: "my blog name"
        }, {
            id: "2",
            title: "Post 2",
            shortDescription: "Post about the post what is to post2",
            content: "a lot of cool text 2",
            blogId: "3274238472398",
            blogName: "my blog name2"
        }],
    blogs: [{
            id: "1",
            name: "string1",
            description: "string1",
            websiteUrl: "string1",
        }, {
            id: "2",
            name: "string2",
            description: "string2",
            websiteUrl: "string2"
        }]
};
// this function clears posts DB if nothing is passed to it. If something is passed it will rewrite current DB
// export const setDB = (dataset?: Partial<DBType>) => {
//     if (!dataset) {
//         db.posts = []
//         return
//     }
//     db.posts = dataset.posts || db.posts
// }
