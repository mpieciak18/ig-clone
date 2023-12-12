import prisma from '../db.js';
// Creates a new follow
export const createFollow = async (req, res, next) => {
    try {
        // First, confirm other user exists
        const otherUser = await prisma.user.findUnique({
            where: { id: req.body.id },
        });
        // If no user is found, handle it at the top-level (server.js) as 500 error
        if (!otherUser)
            throw new Error();
        // Second, create follow
        const follow = await prisma.follow.create({
            data: {
                giverId: req.user.id,
                receiverId: req.body.id,
            },
        });
        // If no follow is created, handle it at the top-level (server.js) as 500 error
        if (!follow)
            throw new Error();
        // Third (and finally), send follow data back to client
        res.json({ follow });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
// Deletes a follow
export const deleteFollow = async (req, res, next) => {
    try {
        // First, delete follow
        const follow = await prisma.follow.delete({
            where: { id: req.body.id },
        });
        // If no follow is found-and-deleted, handle it at the top-level (server.js) as 500 error
        if (!follow)
            throw new Error();
        // Send deleted follow data back to client
        res.json({ follow });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
// Gets a follow based on the other user's ID (if it exists)
export const findFollow = async (req, res, next) => {
    try {
        // First, confirm other user exists
        // If no user is found, handle it at the top-level (server.js) as 500 error
        const otherUser = await prisma.user.findUnique({
            where: { id: req.body.id },
        });
        if (!otherUser)
            throw new Error();
        // Second, find if signed-in user followed other user
        const givenFollow = await prisma.follow.findFirst({
            where: {
                giverId: req.user.id,
                receiverId: req.body.id,
            },
        });
        // Third, find if signed-in user is followed by other user
        const receivedFollow = await prisma.follow.findFirst({
            where: {
                giverId: req.body.id,
                receiverId: req.user.id,
            },
        });
        // Fourth, return data back to client
        res.json({ givenFollow, receivedFollow });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
// Gets the follows given by (any) user
export const getGivenFollows = async (req, res, next) => {
    try {
        // First, confirm if provided user exists
        // If no user is found, handle it at the top-level (server.js) as 500 error
        const otherUser = await prisma.user.findUnique({
            where: { id: req.body.id },
        });
        if (!otherUser)
            throw new Error();
        // Second, retrieve given follows
        const givenFollows = await prisma.follow.findMany({
            where: { giverId: req.body.id },
            take: req.body.limit,
        });
        // Third, return given follows back to client
        res.json({ follows: givenFollows });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
// Gets the follows received by (any) user
export const getReceivedFollows = async (req, res, next) => {
    try {
        // First, confirm if provided user exists
        // If no user is found, handle it at the top-level (server.js) as 500 error
        const otherUser = await prisma.user.findUnique({
            where: { id: req.body.id },
        });
        if (!otherUser)
            throw new Error();
        // Second, retrieve received follows
        const receivedFollows = await prisma.follow.findMany({
            where: { receiverId: req.body.id },
            take: req.body.limit,
        });
        // Third, return given follows back to client
        res.json({ follows: receivedFollows });
    }
    catch (e) {
        // DB errors are handled at top-level (server.js) as 500 error
        next(e);
        return;
    }
};
//# sourceMappingURL=follow.js.map