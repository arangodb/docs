//run: true
//version: 3.10
function test() {

db._create("coll");
db.coll.save({ foo: 123 });
db.coll.save({ foo: true });
let val = 123;
db._query(`
  FOR doc IN coll
    FILTER doc.@attr == @val // A comment!!!!
    RETURN doc
  `, {val});
}