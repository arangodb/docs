---
layout: default
description: The WINDOW keyword can be used for aggregations over related rows
title: Aggregation with WINDOW in AQL
---
WINDOW
=======

The `WINDOW` keyword can be used for aggregations over related rows
i.e. preceding and / or following rows.

 The WINDOW operation performs an COLLECT AGGREGATE-like operation on a set of query rows. 
 However, whereas an COLLECT operation groups multiple query rows into a single result group, 
 a WINDOW operation produces a result for each query row:
 
 - The row for which function evaluation occurs is called the current row.
 - The query rows related to the current row over which function evaluation occurs, comprise the window frame for the current row. 

Window frames are determined with respect to the current row:

- By defining a window frame to be all rows from the query start to the current row, you can compute running totals for each row.
- By defining a frame as extending *N* rows on either side of the current row, you can compute rolling averages. 

There are several syntax variants for `WINDOW` operations:
```
WINDOW {preceding: numPrecedingRows, following: numFollowingRows} AGGREGATE variableName = aggregateExpression
WINDOW rangeValue WITH {preceding: offsetPreceding, following: offsetFollowing} AGGREGATE variableName = aggregateExpression
```

Row based Syntax
----------------

The first syntax form of `WINDOW` allows aggregating over a fixed number of rows, 
following or preceding the current row. The number of rows has to be determined at query compile time.

The below query demonstrates the use of window frames to compute running totals
as well as rolling averages computed from the current row and the rows that immediately precede and follow it: 

```
db._query("
FOR t IN observations
	SORT t.time
	WINDOW {preceding: 1, following: 1} AGGREGATE rollingAvg = AVG(t.val), rollSum = SUM(t.val)
    WINDOW {preceding: 'unbounded', following: 0} AGGREGATE culSum = SUM(t.val)
	RETURN {time: t.time, running_average: rollingAvg, running_total: culSum}
")
```

The below query demonstrates the use of window frames to compute running totals within each group of *time*-ordered query rows, 
as well as rolling averages computed from the current row and the rows that immediately precede and follow it: 

```
db._query("
FOR t IN observations
	COLLECT subject = t.subject INTO group
	LET sq = (FOR t2 IN group
	    SORT t2.time
	    WINDOW {preceding: 1, following: 1} AGGREGATE rollingAvg = AVG(t2.val), rollSum = SUM(t2.val)
	    WINDOW {preceding: 'unbounded', following: 0} AGGREGATE culSum = SUM(t2.val)
	    RETURN {time: t2.time, subject: t2.subject, running_average: rollingAvg, running_total: culSum}
    )
    FOR t2 IN sq
        RETURN t2 // flatten sq
")

+----------+---------+------+---------------+-----------------+
| time     | subject | val  | running_total | running_average |
+----------+---------+------+---------------+-----------------+
| 07:00:00 | st113   |   10 |            10 |          9.5000 |
| 07:15:00 | st113   |    9 |            19 |         14.6667 |
| 07:30:00 | st113   |   25 |            44 |         18.0000 |
| 07:45:00 | st113   |   20 |            64 |         22.5000 |
| 07:00:00 | xh458   |    0 |             0 |          5.0000 |
| 07:15:00 | xh458   |   10 |            10 |          5.0000 |
| 07:30:00 | xh458   |    5 |            15 |         15.0000 |
| 07:45:00 | xh458   |   30 |            45 |         20.0000 |
| 08:00:00 | xh458   |   25 |            70 |         27.5000 |
+----------+---------+------+---------------+-----------------+
```


Range based Syntax
------------------

The second syntax form of `WINDOW` allows aggregating over a all rows within a value range. 
Offsets are differences in row values from the current row value. 

Row values have to be numeric. The offset calculations are performed by adding / subtracting the numeric
offsets specified in the `following` and `preceding` attribute. The offset numbers have to be positive and have
to be determined at query compile time. The default offset is *0*.

The following query demonstrates the use of window frames to compute running totals
as well as rolling averages computed from the current row and the rows that have row values in `t.time` 
in the range of  `[-1000, +500]`, preceding and following:

```
FOR t IN observations
	WINDOW t.time WITH {preceding: 1000, following: 500} AGGREGATE rollingAvg = AVG(t.val), rollSum = SUM(t.val)
	RETURN {time: t.time, running_average: rollingAvg, rolling_sum: rollSum}
```

The range based window syntax required the input rows to be sorted by the row value.
To ensure correctness of the result, the AQL optimizer will automatically insert a `SORT` 
statement into the query in front of the `WINDOW` statement. The optimizer may be able to 
optimize away that `SORT` statement later if a sorted index is present on the group criteria. 

Duration Syntax
---------------

To support WINDOW frames over time-series data the WINDOW operation 
may calculate timestamp offsets using positive ISO duration strings specified in `following` and `preceding`.
If a ISO duration was used the current row value is treated as numeric **timestamp** with **millisecond precision**. 
See [Date functions, comparison and calculation](functions-date.html#comparison-and-calculation) for more information.

The following query demonstrates the use of window frames to compute running totals over observations 
in the last 3 weeks and 2 days:

```
FOR t IN observations
	WINDOW t.time WITH {preceding: "P3W2D"} AGGREGATE rollingAvg = AVG(t.val), rollSum = SUM(t.val)
	RETURN {time: t.time, running_average: rollingAvg, rolling_sum: rollSum}
``
