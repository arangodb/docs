---
fileID: operations-window
title: WINDOW
weight: 3825
description: >-
  Aggregate adjacent documents or value ranges with a sliding window to
  calculate running totals, rolling averages, and other statistical properties
layout: default
---
The `WINDOW` operation can be used for aggregations over adjacent documents, or
preceding and / or following rows in other words. It can also aggregate based
on a value or duration range relative to a document attribute.

The operation performs a `COLLECT AGGREGATE`-like operation on a set
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

## Syntax

There are two syntax variants for `WINDOW` operations.

**Row-based** (adjacent documents):

<pre><code>WINDOW { preceding: <em>numPrecedingRows</em>, following: <em>numFollowingRows</em> } AGGREGATE <em>variableName</em> = <em>aggregateExpression</em></code></pre>

**Range-based** (value or duration range):

<pre><code>WINDOW <em>rangeValue</em> WITH { preceding: <em>offsetPreceding</em>, following: <em>offsetFollowing</em> } AGGREGATE <em>variableName</em> = <em>aggregateExpression</em></code></pre>

Calls to the following functions are supported in aggregation expressions:
- `LENGTH()` / `COUNT()`
- `MIN()`
- `MAX()`
- `SUM()`
- `AVERAGE()` / `AVG()`
- `STDDEV_POPULATION()` / `STDDEV()`
- `STDDEV_SAMPLE()`
- `VARIANCE_POPULATION()` / `VARIANCE()`
- `VARIANCE_SAMPLE()`
- `UNIQUE()`
- `SORTED_UNIQUE()`
- `COUNT_DISTINCT()` / `COUNT_UNIQUE()`
- `BIT_AND()`
- `BIT_OR()`
- `BIT_XOR()`

## Row-based Aggregation

The first syntax form of `WINDOW` allows aggregating over a fixed number of
rows, following or preceding the current row. It is also possible to define
that **all** preceding or following rows should be aggregated (`"unbounded"`).
The number of rows has to be determined at query compile time.

Below query demonstrates the use of window frames to compute **running totals**
as well as **rolling averages** computed from the current row and the rows that
immediately precede and follow it:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: windowAggregationRow
description: ''
render: input/output
version: '3.10'
release: stable
dataset: observationsSampleDataset
---
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
rollingSum, // sum of the window's values
cumulativeSum   // running total
  }
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

The row order is controlled by the `SORT` operation on the `time` attribute.

The first `WINDOW` operation aggregates the previous, current, and next row
(preceding and following is set to 1) and calculates the average and sum of
these three values. In case of the first row, there is no preceding row but a
following row, hence the values `10` and `0` are added up to calculate the sum,
which is divided by 2 to compute the average. For the second row, the values
`10`, `0` and `9` are summed up and divided by 3, and so on.

The second `WINDOW` operation aggregates all previous values (unbounded) to
calculate a running sum. For the first row, that is just `10`, for the second
row it is `10` + `0`, for the third `10` + `0` + `9`, and so on.

| time                | subject | val | rollingAverage | rollingSum | cumulativeSum |
|---------------------|---------|----:|---------------:|-----------:|--------------:|
| 2021-05-25 07:00:00 |   st113 |  10 |              5 |         10 |            10 |
| 2021-05-25 07:00:00 |   xh458 |   0 |         6.333… |         19 |            10 |
| 2021-05-25 07:15:00 |   st113 |   9 |         6.333… |         19 |            19 |
| 2021-05-25 07:15:00 |   xh458 |  10 |        14.666… |         44 |            29 |
| 2021-05-25 07:30:00 |   st113 |  25 |        13.333… |         40 |            54 |
| 2021-05-25 07:30:00 |   xh458 |   5 |        16.666… |         50 |            59 |
| 2021-05-25 07:45:00 |   st113 |  20 |        18.333… |         55 |            79 |
| 2021-05-25 07:45:00 |   xh458 |  30 |             25 |         75 |           109 |
| 2021-05-25 08:00:00 |   xh458 |  25 |           27.5 |         55 |           134 |

The below query demonstrates the use of window frames to compute running totals
within each `subject` group of `time`-ordered query rows, as well as rolling
sums and averages computed from the current row and the rows that immediately
precede and follow it, also per `subject` group and sorted by `time`:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: windowAggregationRowGrouped
description: ''
render: input/output
version: '3.10'
release: stable
dataset: observationsSampleDataset
---
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
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

If you look at the first row with the subject `xh458`, then you can see the
cumulative sum reset and that the rolling average and sum does not take the
previous row into account that belongs to subject `st113`.

| time                | subject | val | rollingAverage | rollingSum | cumulativeSum |
|---------------------|---------|----:|---------------:|-----------:|--------------:|
| 2021-05-25 07:00:00 | st113   |  10 |            9.5 |         19 |            10 |
| 2021-05-25 07:15:00 | st113   |   9 |        14.666… |         44 |            19 |
| 2021-05-25 07:30:00 | st113   |  25 |             18 |         54 |            44 |
| 2021-05-25 07:45:00 | st113   |  20 |           22.5 |         45 |            64 |
| 2021-05-25 07:00:00 | xh458   |   0 |              5 |         10 |             0 |
| 2021-05-25 07:15:00 | xh458   |  10 |              5 |         15 |            10 |
| 2021-05-25 07:30:00 | xh458   |   5 |             15 |         45 |            15 |
| 2021-05-25 07:45:00 | xh458   |  30 |             20 |         60 |            45 |
| 2021-05-25 08:00:00 | xh458   |  25 |           27.5 |         55 |            70 |

## Range-based Aggregation

The second syntax form of `WINDOW` allows aggregating over a all documents
within a value range. Offsets are differences in attribute values from the
current document.

Attribute values have to be numeric. The offset calculations are performed by
adding or subtracting the numeric offsets specified in the `following` and
`preceding` attribute. The offset numbers have to be positive and have to be
determined at query compile time. The default offset is `0`.

The range based window syntax requires the input rows to be sorted by the row
value. To ensure correctness of the result, the AQL optimizer will
automatically insert a `SORT` statement into the query in front of the `WINDOW`
statement. The optimizer may be able to optimize away that `SORT` statement
later if a sorted index is present on the group criteria.

The following query demonstrates the use of window frames to compute totals as
well as averages computed from the current document and the documents that have
attribute values in `t.val` in the range of `[-10, +5]` (inclusive), preceding
and following:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: windowAggregationRangeValue
description: ''
render: input/output
version: '3.10'
release: stable
dataset: observationsSampleDataset
---
FOR t IN observations
  WINDOW t.val WITH { preceding: 10, following: 5 }
  AGGREGATE rollingAverage = AVG(t.val), rollingSum = SUM(t.val)
  RETURN {
time: t.time,
subject: t.subject,
val: t.val,
rollingAverage,
rollingSum
  }
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

The value range of the first row is `[-10, 5]` since `val` is `0`, thus the
values from the first and second row are added up to `5` with the average being
`2.5`. The value range of the last row is `[20, 35]` as `val` is `30`, which
means that the last four rows get aggregated to a sum of `100` and an average
of `25` (the range is inclusive, i.e. `val` falls within the range with a value
of `20`).

| time                | subject | val | rollingAverage | rollingSum |
|---------------------|---------|----:|---------------:|-----------:|
| 2021-05-25 07:00:00 | xh458   |   0 |            2.5 |          5 |
| 2021-05-25 07:30:00 | xh458   |   5 |            6.8 |         34 |
| 2021-05-25 07:15:00 | st113   |   9 |            6.8 |         34 |
| 2021-05-25 07:00:00 | st113   |  10 |            6.8 |         34 |
| 2021-05-25 07:15:00 | xh458   |  10 |            6.8 |         34 |
| 2021-05-25 07:45:00 | st113   |  20 |             18 |         90 |
| 2021-05-25 07:30:00 | st113   |  25 |             25 |        100 |
| 2021-05-25 08:00:00 | xh458   |  25 |             25 |        100 |
| 2021-05-25 07:45:00 | xh458   |  30 |             25 |        100 |

## Duration-based Aggregation

Aggregating by time intervals is a subtype of range-based aggregation that
uses the second syntax form of `WINDOW` but with ISO durations.

To support `WINDOW` frames over time-series data the `WINDOW` operation may
calculate timestamp offsets using positive ISO 8601 duration strings, like
`P1Y6M` (1 year and 6 months) or `PT12H30M` (12 hours and 30 minutes). Also see
[Date functions](../functions/functions-date#comparison-and-calculation).
In contrast to the ISO 8601 standard, week components may be freely combined
with other components. For example, `P1WT1H` and `P1M1W` are both valid.
Fractional values are only supported for seconds, and only with up to three
decimals after the separator, i.e., millisecond precision. For example,
`PT0.123S` is a valid duration while `PT0.5H` and `PT0.1234S` are not.

Durations can be specified separately in `following` and `preceding`.
If such a duration is used, then the attribute value of the current document
must be a number and is treated as numeric **timestamp in milliseconds**.
The range is inclusive. If either bound is not specified, it is treated as an
empty duration (i.e., `P0D`).

The following query demonstrates the use of window frames to compute rolling
sums and averages over observations in the last 30 minutes (inclusive), based
on the document attribute `time` that is converted from a datetime string to a
numeric timestamp:

    
 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: windowAggregationRangeDuration
description: ''
render: input/output
version: '3.10'
release: stable
dataset: observationsSampleDataset
---
FOR t IN observations
  WINDOW DATE_TIMESTAMP(t.time) WITH { preceding: "PT30M" }
  AGGREGATE rollingAverage = AVG(t.val), rollingSum = SUM(t.val)
  RETURN {
time: t.time,
subject: t.subject,
val: t.val,
rollingAverage,
rollingSum
  }
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    
    

With a time of `07:30:00`, everything from `07:00:00` to `07:30:00` on the same
day falls within the duration range with `preceding: "PT30M"`, thus aggregating
the top six rows to a sum of `59` and an average of `9.8333…`.

| time                | subject | val | rollingAverage | rollingSum |
|---------------------|---------|----:|---------------:|-----------:|
| 2021-05-25 07:00:00 | st113   |  10 |              5 |         10 |
| 2021-05-25 07:00:00 | xh458   |   0 |              5 |         10 |
| 2021-05-25 07:15:00 | st113   |   9 |           7.25 |         29 |
| 2021-05-25 07:15:00 | xh458   |  10 |           7.25 |         29 |
| 2021-05-25 07:30:00 | st113   |  25 |        9.8333… |         59 |
| 2021-05-25 07:30:00 | xh458   |   5 |        9.8333… |         59 |
| 2021-05-25 07:45:00 | st113   |  20 |           16.5 |         99 |
| 2021-05-25 07:45:00 | xh458   |  30 |           16.5 |         99 |
| 2021-05-25 08:00:00 | xh458   |  25 |             21 |        105 |
