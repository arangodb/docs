#!/bin/bash

rm -f redirects.json
for j in 3.5 3.4 3.3 3.2 3.1 3.0; do
    for i in AQL Cookbook HTTP; do
        node scripts/nav2json.js ../arangodb-$j/Documentation/Books/$i/SUMMARY.md | jq . > _data/$j-${i,,}.json
        node scripts/migrate.js ../arangodb-$j/Documentation/Books/$i $j/${i,,} >> redirects.json
    done
    node scripts/nav2json.js ../arangodb-$j/Documentation/Books/Manual/SUMMARY.md | jq . > _data/$j-manual.json
    node scripts/migrate.js ../arangodb-$j/Documentation/Books/Manual $j >> redirects.json
done

for j in 3.4 3.5; do
    for i in Drivers; do
        node scripts/nav2json.js ../arangodb-$j/Documentation/Books/$i/SUMMARY.md | jq . > _data/$j-${i,,}.json
        node scripts/migrate.js ../arangodb-$j/Documentation/Books/$i $j/${i,,} >> redirects.json
    done
done

node scripts/migrate.js ../arangodb-2.8/Documentation/Books/Cookbook/ 2.8/cookbook >> redirects.json
node scripts/nav2json.js ../arangodb-2.8/Documentation/Books/Cookbook/SUMMARY.md  | jq . > _data/2.8-cookbook.json
node scripts/migrate.js ../arangodb-2.8/Documentation/Books/Users/ 2.8 >> redirects.json
node scripts/nav2json.js ../arangodb-2.8/Documentation/Books/Users/SUMMARY.md  | jq . > _data/2.8-manual.json
