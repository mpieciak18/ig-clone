#!/bin/bash
cp -r ../server/node_modules/@prisma/client ../shared/types/@prisma/client
cp -r ../server/node_modules/.prisma/client ../shared/types/.prisma/client
echo "Prisma types copied!"