---
layout: default
description: The WINDOW keyword can be used for aggregations over related rows
title: Aggregation with WINDOW in AQL
---
WINDOW
=======

The `WINDOW` keyword can be used for aggregations over related rows, usually
preceding and / or following rows.

The `WINDOW` operation performs a `COLLECT AGGREGATE`-like operation on a set
of query rows. However, whereas a `COLLECT` operation groups multiple query
rows into a single result group, a `WINDOW` operation produces a result for
each query row:

- The row for which function evaluation occurs is called the current row.
- The query rows related to the current row over which function evaluation
  occurs, comprise the window frame for the current row.

Window frames are determined with respect to the current row:

- By defining a window frame to be all rows from the query start to the current
  row, you can compute running totals for each row.
- By defining a frame as extending *N* rows on either side of the current row,
  you can compute rolling averages.

Syntax
------

There are several syntax variants for `WINDOW` operations:

<pre><code>WINDOW { preceding: <em>numPrecedingRows</em>, following: <em>numFollowingRows</em> } AGGREGATE <em>variableName</em> = <em>aggregateExpression</em>
WINDOW <em>rangeValue</em> WITH { preceding: <em>offsetPreceding</em>, following: <em>offsetFollowing</em> } AGGREGATE <em>variableName</em> = <em>aggregateExpression</em></code></pre>

### Row-based Syntax

The first syntax form of `WINDOW` allows aggregating over a fixed number of
rows, following or preceding the current row. The number of rows has to be
determined at query compile time.

Below query demonstrates the use of window frames to compute **running totals**
as well as **rolling averages** computed from the current row and the rows that
immediately precede and follow it:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline windowAggregationRow1
    @EXAMPLE_AQL{windowAggregationRow1}
    @DATASET{observationsSampleDataset}
    FOR t IN observations
      SORT t.time
      WINDOW { preceding: 1, following: 1 }
      AGGREGATE rollingAverage = AVG(t.val), rollingSum = SUM(t.val)
      WINDOW { preceding: "unbounded", following: 0}
      AGGREGATE cumulativeSum = SUM(t.val)
      RETURN {
        time: t.time,
        subject: t.subject,
        val: t.val,
        rollingAverage, // average of the window's values
        rollingSum,     // sum of the window's values
        cumulativeSum   // running total
      }
    @END_EXAMPLE_AQL
    @endDocuBlock windowAggregationRow1
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

The below query demonstrates the use of window frames to compute running totals
within each group of `time`-ordered query rows, as well as rolling averages
computed from the current row and the rows that immediately precede and follow it:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline windowAggregationRow2
    @EXAMPLE_AQL{windowAggregationRow2}
    @DATASET{observationsSampleDataset}
    FOR t IN observations
      COLLECT subject = t.subject INTO group = t
      LET subquery = (FOR t2 IN group
        SORT t2.time
        WINDOW { preceding: 1, following: 1 }
        AGGREGATE rollingAverage = AVG(t2.val), rollingSum = SUM(t2.val)
        WINDOW { preceding: "unbounded", following: 0 }
        AGGREGATE cumulativeSum = SUM(t2.val)
        RETURN {
          time: t2.time,
          subject: t2.subject,
          val: t2.val,
          rollingAverage,
          rollingSum,
          cumulativeSum
        }
      )
      // flatten subquery result
      FOR t2 IN subquery
        RETURN t2
    @END_EXAMPLE_AQL
    @endDocuBlock windowAggregationRow2
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

| time     | subject | val | rollingAverage | rollingSum | cumulativeSum |
|----------|---------|----:|---------------:|-----------:|--------------:|
| 07:00:00 | st113   |  10 |            9.5 |         19 |            10 |
| 07:15:00 | st113   |   9 |        14.666… |         44 |            19 |
| 07:30:00 | st113   |  25 |             18 |         54 |            44 |
| 07:45:00 | st113   |  20 |           22.5 |         45 |            64 |
| 07:00:00 | xh458   |   0 |              5 |         10 |             0 |
| 07:15:00 | xh458   |  10 |              5 |         15 |            10 |
| 07:30:00 | xh458   |   5 |             15 |         45 |            15 |
| 07:45:00 | xh458   |  30 |             20 |         60 |            45 |
| 08:00:00 | xh458   |  25 |           27.5 |         55 |            70 |

### Range-based Syntax

The second syntax form of `WINDOW` allows aggregating over a all documents
within a value range. Offsets are differences in attribute values from the
current document.

Attribute values have to be numeric. The offset calculations are performed by
adding or subtracting the numeric offsets specified in the `following` and
`preceding` attribute. The offset numbers have to be positive and have to be
determined at query compile time. The default offset is `0`.

The following query demonstrates the use of window frames to compute totals as
well as averages computed from the current document and the documents that have
attribute values in `t.val` in the range of `[-10, +5]` (inclusive), preceding
and following:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline windowAggregationRangeValue
    @EXAMPLE_AQL{windowAggregationRangeValue}
    @DATASET{observationsSampleDataset}
    FOR t IN observations
      WINDOW t.val WITH { preceding: 10, following: 5 }
      AGGREGATE average = AVG(t.val), sum = SUM(t.val)
      RETURN {
        time: t.time,
        subject: t.subject,
        val: t.val,
        average,
        sum
      }
    @END_EXAMPLE_AQL
    @endDocuBlock windowAggregationRangeValue
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

| time     | subject | val | average | sum |
|----------|---------|----:|--------:|----:|
| 07:00:00 | xh458   |   0 |     2.5 |   5 |
| 07:30:00 | xh458   |   5 |     6.8 |  34 |
| 07:15:00 | st113   |   9 |     6.8 |  34 |
| 07:00:00 | st113   |  10 |     6.8 |  34 |
| 07:15:00 | xh458   |  10 |     6.8 |  34 |
| 07:45:00 | st113   |  20 |      18 |  90 |
| 07:30:00 | st113   |  25 |      25 | 100 |
| 08:00:00 | xh458   |  25 |      25 | 100 |
| 07:45:00 | xh458   |  30 |      25 | 100 |

The range based window syntax required the input rows to be sorted by the row
value. To ensure correctness of the result, the AQL optimizer will
automatically insert a `SORT` statement into the query in front of the `WINDOW`
statement. The optimizer may be able to optimize away that `SORT` statement
later if a sorted index is present on the group criteria.

### Duration Syntax

To support `WINDOW` frames over time-series data the `WINDOW` operation may
calculate timestamp offsets using positive ISO 8601 duration strings specified
in `following` and `preceding`. If such a duration is used, then the attribute
value of the current document is treated as numeric **timestamp in seconds**,
optionally with **millisecond precision**. Also see
[Date functions](functions-date.html#comparison-and-calculation).
If either bound is not specified, it is treated as an empty duration
(i.e., `P0D`).

The following query demonstrates the use of window frames to compute running
totals and rolling averages over observations in the last 1 month and 2 days:

<!-- TODO: Use different dataset with ISO datetimes and WINDOW DATE_TIMESTAMP(t.time) WITH ... ? -->

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline windowAggregationRangeDuration
    @EXAMPLE_AQL{windowAggregationRangeDuration}
    @DATASET{observationsSampleDataset}
    FOR t IN observations
      WINDOW t.time WITH { preceding: "P1M2D" }
      AGGREGATE rollingAverage = AVG(t.val), rollingSum = SUM(t.val)
      RETURN {
        time: t.time,
        rollingAverage,
        rollingSum
      }
    @END_EXAMPLE_AQL
    @endDocuBlock windowAggregationRangeDuration
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

In contrast to the ISO 8601 standard week components may be freely combined
with other components. For example, `P1WT1H` and `P1M1W` are both valid.
Fractional values are only supported for seconds, and only with up to three
decimals after the separator, i.e., millisecond precision. For example,
`PT0.123S` is a valid duration while `PT0.5H` and `PT0.1234S` are not.
