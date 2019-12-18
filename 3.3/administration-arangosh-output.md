---
layout: default
description: The ArangoDB shell will print the output of the last evaluated expressionby default
---
ArangoDB Shell Output
=====================

The ArangoDB shell will print the output of the last evaluated expression
by default:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}    
    @startDocuBlockInline lastExpressionResult
    @EXAMPLE_ARANGOSH_OUTPUT{lastExpressionResult}
    42 * 23
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock lastExpressionResult
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}    

In order to prevent printing the result of the last evaluated expression,
the expression result can be captured in a variable, e.g.

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline lastExpressionResultCaptured
    @EXAMPLE_ARANGOSH_OUTPUT{lastExpressionResultCaptured}
    var calculationResult = 42 * 23
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock lastExpressionResultCaptured
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

There is also the `print` function to explicitly print out values in the
ArangoDB shell:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline printFunction
    @EXAMPLE_ARANGOSH_OUTPUT{printFunction}
    print({ a: "123", b: [1,2,3], c: "test" });
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock printFunction
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

By default, the ArangoDB shell uses a pretty printer when JSON documents are
printed. This ensures documents are printed in a human-readable way:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline usingToArray
    @EXAMPLE_ARANGOSH_OUTPUT{usingToArray}
    db._create("five")
    for (i = 0; i < 5; i++) db.five.save({value:i})
    db.five.toArray()
    ~db._drop("five");
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock usingToArray
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

While the pretty-printer produces nice looking results, it will need a lot of
screen space for each document. Sometimes a more dense output might be better.
In this case, the pretty printer can be turned off using the command
*stop_pretty_print()*.

To turn on pretty printing again, use the *start_pretty_print()* command.

