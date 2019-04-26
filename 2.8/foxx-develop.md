---
layout: default
description: This chapter will explain to you how to write a Foxx on your own and use it to enhance the ArangoDB's functionality
---
Develop your own Foxx
=====================

This chapter will explain to you how to write a Foxx on your own and use it to enhance the ArangoDB's functionality.
Be it a microservice, an API with a user interface or an internal library.

Before reading this chapter you should make sure to at least read one of the install sections beforehand to get a good staring point.
Recommended is the [generate](foxx-install-generate.html) section to get started with your own Foxx, but you can also start with an existing one.

Development Mode
----------------

At first we will introduce the development mode and describe its side effects.
You can skip this section if you do not have access to the file system of ArangoDB as you will not get the benefits of this mode.
You will have to stick to the procedure described in [New Versions](foxx-production-upgrade.html).

[Read More](foxx-develop-developmentmode.html)

Debugging
---------

Next you will learn about the debugging mechanisms if you have set a Foxx into development mode.
The app will return more debugging information in this mode like stacktraces.
In production mode stacktraces will be kept internally.

[Read More](foxx-develop-debugging.html)

Folder structure
----------------

If you want to get started with coding this is the section to begin with.
It will introduce the folder structure and describes where which files have to be located on server side.

[Read More](foxx-develop-folder.html)

Framework and tools
-------------------

Now we are entering the reference documentation of tools available in the Foxx framework.
The tools contain:

  * [Controller](foxx-develop-controller.html)
  * [Setup & Teardown](foxx-develop-scripts.html)
  * [Repository](foxx-develop-repository.html)
  * [Model](foxx-develop-model.html)
  * [Queries](foxx-develop-queries.html)
  * [Background Tasks](foxx-develop-queues.html)
  * [Console API](foxx-develop-console.html)
  * you may use [Javascript Modules](module-java-script.html) and [install node modules using npm](module-java-script.html#installing-npm-modules) in the directory containing your `manifest.json`.

Finally we want to apply some meta information to the Foxx.
How this is done is described in the [Meta information](foxx-develop-manifest.html) chapter.

