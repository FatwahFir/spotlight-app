import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./user";

export const addComment = mutation({
    args: {
        content: v.string(),
        postId: v.id('posts'),
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)

        const post = await ctx.db.get(args.postId)
        if(!post) throw new ConvexError('Post not found')
        
        const commentId = await ctx.db.insert('comments', {
            'userId': currentUser._id,
            postId: args.postId,
            content: args.content,
        })

        await ctx.db.patch(args.postId, {comments: post.comments + 1})

        if (currentUser._id !== post.userId) {
            await ctx.db.insert('notifications',{
                receiverId: post.userId,
                senderId: currentUser._id,
                type: 'comment',
                postId: args.postId,
                commentId,
            })
        }

        return commentId
    }
})

export const getComments = query({
    args:{
        postId: v.id('posts')
    },
    handler: async (ctx, args) => {
        const comments = await ctx.db.query('comments')
        .withIndex('by_post_id', (q)=>q.eq('postId', args.postId))
        .collect()

        const commentsWithInfo = await Promise.all(
            comments.map(async (comment)=>{
                const user = await ctx.db.get(comment.userId)
                return {
                    ...comment,
                    user: {
                        fullname: user?.fullname,
                        image: user?.image
                    }
                }
            })
        )

        return commentsWithInfo
    }
})