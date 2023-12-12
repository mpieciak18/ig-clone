import prisma from '../db.js';
// Creates a save
export const createSave = async (req, res, next) => {
    try {
        // First, attempt to create save
        const save = await prisma.save.create({
            data: {
                postId: req.body.id,
                userId: req.user.id,
            },
        });
        // If no post is created, handle it at the top-level (server.js) as 500 error
        if (!save)
            throw new Error();
        // Second, send save data back to client
        res.json({ save });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
// Gets (limited number of) saves for user
export const getSaves = async (req, res, next) => {
    try {
        // First, get all saves from user with limit
        // If no saves are found, handle it at the top-level (server.js) as 500 error
        const saves = await prisma.save.findMany({
            where: { userId: req.user.id },
            take: req.body.limit,
            orderBy: { createdAt: 'desc' },
            include: {
                post: {
                    include: {
                        _count: {
                            select: {
                                comments: true,
                                likes: true,
                            },
                        },
                    },
                },
            },
        });
        if (!saves)
            throw new Error();
        // Second, return saves back to client
        res.json({ saves });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
// Deletes a save
export const deleteSave = async (req, res, next) => {
    try {
        // First, attempt to delete the save
        const save = await prisma.save.delete({
            where: { id: req.body.id },
        });
        // If no save is found-and-deleted, handle it at the top-level (server.js) as 500 error
        if (!save)
            throw new Error();
        // Finally, send deleted save back to client
        res.json({ save });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
// Gets save based on user id & post id
export const getSavePost = async (req, res, next) => {
    try {
        // First, get save for post based on user id & post id
        const save = await prisma.save.findFirst({
            where: { postId: req.body.id, userId: req.user.id },
        });
        // Second, return save (found or not) back to client
        res.json({ save });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
//# sourceMappingURL=save.js.map