---
layout: default
description: AQL offers functionality to work with dates as numeric timestamps and as ISO 8601 date time strings
title: AQL Date Functions
---
Date functions
==============

AQL offers functionality to work with dates, but it does not have a special data type
for dates (neither does JSON, which is usually used as format to ship data into and
out of ArangoDB). Instead, dates in AQL are represented by either numbers or strings.

All date function operations are done in the *Unix time* system. Unix time counts
all non leap seconds beginning with January 1st 1970 00:00:00.000 UTC, also know as
the Unix epoch. A point in time is called timestamp. A timestamp has the same value
at every point on earth. The date functions use millisecond precision for timestamps.

Time unit definitions:

- **millisecond**: 1/1000 of a second
- **second**: one [SI second](https://www.bipm.org/en/publications/si-brochure/second.html){:target="_blank"}
- **minute**: one minute is defined as 60 seconds
- **hour**: one hour is defined as 60 minutes
- **day**: one day is defined as 24 hours
- **week**: one week is defined as 7 days
- **month**: one month is defined as 1/12 of a year
- **year**: one year is defined as 365.2425 days

All functions that require dates as arguments accept the following input values:

- **numeric timestamps**, millisecond precision.

  An example timestamp value is `1399472349522`, which translates to
  `2014-05-07T14:19:09.522Z`.

  Valid range: `-62167219200000` .. `253402300799999` (inclusive)

- **date time strings** in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601){:target="_blank"} format:
  - `YYYY-MM-DDTHH:MM:SS.MMM`
  - `YYYY-MM-DD HH:MM:SS.MMM`
  - `YYYY-MM-DD`

  Milliseconds (`.MMM`) are always optional. Two digits for the hours (`HH`),
  minutes (`MM`) and seconds (`SS`) are mandatory, i.e. zero-padding is required
  for the values 0 through 9 (e.g. `05` instead of `5`). Leading zeroes for the
  year (`YYYY`), month (`MM`) and day (`DD`) can be left out, but is discouraged.

  A time offset may optionally be added at the end of the string, with the
  hours and minutes that need to be added or subtracted to the date time value.
  For example, `2014-05-07T14:19:09+01:00` can be used to specify a one hour offset,
  and `2014-05-07T14:19:09+07:30` can be specified for seven and half hours offset.
  Negative offsets are also possible. Alternatively to an offset, a `Z` can be used
  to indicate UTC / Zulu time. An example value is `2014-05-07T14:19:09.522Z`
  meaning May 7th 2014, 14:19:09 and 522 milliseconds, UTC / Zulu time.
  Another example value without time component is `2014-05-07Z`.

  Valid range: `"0000-01-01T00:00:00.000Z"` .. `"9999-12-31T23:59:59.999Z"` (inclusive)

Any date/time values outside the valid range that are passed into an AQL date
function will make the function return `null` and trigger a warning for the query,
which can optionally be escalated to an error and abort the query. This also
applies to operations which produce an invalid value.

```aql
DATE_HOUR( 2 * 60 * 60 * 1000 ) // 2
DATE_HOUR("1970-01-01T02:00:00") // 2
```

You are free to store age determinations of specimens, incomplete or fuzzy dates and
the like in different, more appropriate ways of course. AQL's date functions will
most certainly not be of any help for such dates, but you can still use language
constructs like [SORT](operations-sort.html) (which also supports sorting of arrays)
and [indexes](../indexing.html).

Current date and time
---------------------

### DATE_NOW()

`DATE_NOW() → timestamp`

Get the current unix time as numeric timestamp.

- returns **timestamp** (number): the current unix time as a timestamp.
  The return value has millisecond precision. To convert the return value to
  seconds, divide it by 1000.

Note that this function is evaluated on every invocation and may return
different values when invoked multiple times in the same query. Assign it
to a variable to use the exact same timestamp multiple times.

Conversion
----------

*DATE_TIMESTAMP()* and *DATE_ISO8601()* can be used to convert ISO 8601 date time
strings to numeric timestamps and numeric timestamps to ISO 8601 date time strings.

Both also support individual date components as separate function arguments,
in the following order:

- year
- month
- day
- hour
- minute
- second
- millisecond

All components following *day* are optional and can be omitted. Note that no
time offset can be specified when using separate date components, and UTC /
Zulu time will be used.

The following calls to *DATE_TIMESTAMP()* are equivalent and will all return
*1399472349522*:

```aql
DATE_TIMESTAMP("2014-05-07T14:19:09.522")
DATE_TIMESTAMP("2014-05-07T14:19:09.522Z")
DATE_TIMESTAMP("2014-05-07 14:19:09.522")
DATE_TIMESTAMP("2014-05-07 14:19:09.522Z")
DATE_TIMESTAMP(2014, 5, 7, 14, 19, 9, 522)
DATE_TIMESTAMP(1399472349522)
```

The same is true for calls to *DATE_ISO8601()* that also accepts variable input
formats:

```aql
DATE_ISO8601("2014-05-07T14:19:09.522Z")
DATE_ISO8601("2014-05-07 14:19:09.522Z")
DATE_ISO8601(2014, 5, 7, 14, 19, 9, 522)
DATE_ISO8601(1399472349522)
```

The above functions are all equivalent and will return *"2014-05-07T14:19:09.522Z"*.

### DATE_ISO8601()

`DATE_ISO8601(date) → dateString`

Return an ISO 8601 date time string from *date*.
The date time string will always use UTC / Zulu time, indicated by the *Z* at its end.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **dateString**: date and time expressed according to ISO 8601, in Zulu time

---

`DATE_ISO8601(year, month, day, hour, minute, second, millisecond) → dateString`

Return a ISO 8601 date time string from *date*, but allows to specify the individual
date components separately. All parameters after *day* are optional.

- **year** (number): typically in the range 0..9999, e.g. *2017*
- **month** (number): 1..12 for January through December
- **day** (number): 1..31 (upper bound depends on number of days in month)
- **hour** (number, *optional*): 0..23
- **minute** (number, *optional*): 0..59
- **second** (number, *optional*): 0..59
- **milliseconds** (number, *optional*): 0..999
- returns **dateString**: date and time expressed according to ISO 8601, in Zulu time

### DATE_TIMESTAMP()

`DATE_TIMESTAMP(date) → timestamp`

Create a timestamp value from *date*. The return value has millisecond precision.
To convert the return value to seconds, divide it by 1000.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **timestamp** (number): numeric timestamp

---

`DATE_TIMESTAMP(year, month, day, hour, minute, second, millisecond) → timestamp`

Create a timestamp value, but allows to specify the individual date components
separately. All parameters after *day* are optional.

- **year** (number): typically in the range 0..9999, e.g. *2017*
- **month** (number): 1..12 for January through December
- **day** (number): 1..31 (upper bound depends on number of days in month)
- **hour** (number, *optional*): 0..23
- **minute** (number, *optional*): 0..59
- **second** (number, *optional*): 0..59
- **milliseconds** (number, *optional*): 0..999
- returns **timestamp** (number): numeric timestamp

Negative values are not allowed, result in *null* and cause a warning.
Values greater than the upper range bound overflow to the larger components
(e.g. an hour of 26 is automatically turned into an additional day and two hours):

```aql
DATE_TIMESTAMP(2016, 12, -1) // returns null and issues a warning
DATE_TIMESTAMP(2016, 2, 32) // returns 1456963200000, which is March 3rd, 2016
DATE_TIMESTAMP(1970, 1, 1, 26) // returns 93600000, which is January 2nd, 1970, at 2 a.m.
```

### IS_DATESTRING()

`IS_DATESTRING(value) → bool`

Check if an arbitrary string is suitable for interpretation as date time string.

- **value** (string): an arbitrary string
- returns **bool** (bool): *true* if *value* is a string that can be used
  in a date function. This includes partial dates such as *2015* or *2015-10* and
  strings containing invalid dates such as *2015-02-31*. The function will return
  *false* for all non-string values, even if some of them may be usable in date
  functions.

Processing
----------

### DATE_DAYOFWEEK()

`DATE_DAYOFWEEK(date) → weekdayNumber`

Return the weekday number of *date*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **weekdayNumber** (number): 0..6 as follows:
  - 0 – Sunday
  - 1 – Monday
  - 2 – Tuesday
  - 3 – Wednesday
  - 4 – Thursday
  - 5 – Friday
  - 6 – Saturday

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedyofwk1
  @EXAMPLE_AQL{datedyofwk1}
    RETURN DATE_DAYOFWEEK("2020-08-29")
  @END_EXAMPLE_AQL
  @endDocuBlock datedyofwk1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedyofwk2
  @EXAMPLE_AQL{datedyofwk2}
    RETURN DATE_DAYOFWEEK(0)
  @END_EXAMPLE_AQL
  @endDocuBlock datedyofwk2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_YEAR()

`DATE_YEAR(date) → year`

Return the year of *date*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **year** (number): the year part of *date* as a number

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline dateyr1
  @EXAMPLE_AQL{dateyr1}
    RETURN DATE_YEAR("2020-08-29")
  @END_EXAMPLE_AQL
  @endDocuBlock dateyr1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline dateyr2
  @EXAMPLE_AQL{dateyr2}
    RETURN DATE_YEAR(0)
  @END_EXAMPLE_AQL
  @endDocuBlock dateyr2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_MONTH()

`DATE_MONTH(date) → month`

Return the month of *date*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **month** (number): the month part of *date* as a number

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datemn1
  @EXAMPLE_AQL{datemn1}
    RETURN DATE_MONTH("2020-08-29")
  @END_EXAMPLE_AQL
  @endDocuBlock datemn1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datemn2
  @EXAMPLE_AQL{datemn2}
    RETURN DATE_MONTH(0)
  @END_EXAMPLE_AQL
  @endDocuBlock datemn2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_DAY()

`DATE_DAY(date) → day`

Return the day of *date*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **day** (number): the day part of *date* as a number

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedy1
  @EXAMPLE_AQL{datedy1}
    RETURN DATE_DAY("2020-08-29")
  @END_EXAMPLE_AQL
  @endDocuBlock datedy1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedy2
  @EXAMPLE_AQL{datedy2}
    RETURN DATE_DAY(0)
  @END_EXAMPLE_AQL
  @endDocuBlock datedy2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_HOUR()

Return the hour of *date*.

`DATE_HOUR(date) → hour`

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **hour** (number): the hour part of *date* as a number

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datehr1
  @EXAMPLE_AQL{datehr1}
    RETURN DATE_HOUR("2020-08-29T16:30:05.123")
  @END_EXAMPLE_AQL
  @endDocuBlock datehr1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_MINUTE()

`DATE_MINUTE(date) → minute`

Return the minute of *date*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **minute** (number): the minute part of *date* as a number

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datemin1
  @EXAMPLE_AQL{datemin1}
    RETURN DATE_MINUTE("2020-08-29T16:30:05.123")
  @END_EXAMPLE_AQL
  @endDocuBlock datemin1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_SECOND()

`DATE_SECOND(date) → second`

Return the second of *date*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **second** (number): the seconds part of *date* as a number

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datesec1
  @EXAMPLE_AQL{datesec1}
    RETURN DATE_SECOND("2020-08-29T16:30:05.123")
  @END_EXAMPLE_AQL
  @endDocuBlock datesec1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_MILLISECOND()

`DATE_MILLISECOND(date) → millisecond`

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **millisecond** (number): the milliseconds part of *date* as a number

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datemilsec1
  @EXAMPLE_AQL{datemilsec1}
    RETURN DATE_MILLISECOND("2020-08-29T16:30:05.123")
  @END_EXAMPLE_AQL
  @endDocuBlock datemilsec1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_DAYOFYEAR()

`DATE_DAYOFYEAR(date) → dayOfYear`

Return the day of year of *date*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **dayOfYear** (number): the day of year number of *date*.
  The return values range from 1 to 365, or 366 in a leap year respectively.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedyofyr1
  @EXAMPLE_AQL{datedyofyr1}
    RETURN DATE_DAYOFYEAR("2020-08-29")
  @END_EXAMPLE_AQL
  @endDocuBlock datedyofyr1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_ISOWEEK()

`DATE_ISOWEEK(date) → weekDate`

Return the week year number of *date* according to ISO 8601.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **weekDate** (number): the ISO week year number of *date*. The return values
  range from 1 to 53. Monday is considered the first day of the week. There are no
  fractional weeks, thus the last days in December may belong to the first week of
  the next year, and the first days in January may be part of the previous year's
  last week.

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline dateisofwk1
  @EXAMPLE_AQL{dateisofwk1}
    RETURN DATE_ISOWEEK("2020-08-29")
  @END_EXAMPLE_AQL
  @endDocuBlock dateisofwk1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_ISOWEEKYEAR()

`DATE_ISOWEEKYEAR(date) → weekAndYear`

Return the week year number of *date* according to ISO 8601 and the year the
week belongs to.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **weekAndYear** (object): an object with two attributes
  - **week** (number): the ISO week year number of *date*. The values range from 1 to 53.
    Monday is considered the first day of the week. There are no fractional weeks,
    thus the last days in December may belong to the first week of the next year,
    and the first days in January may be part of the previous year's last week.
  - **year** (number): the year to which the ISO week year number belongs to

**Examples**

January 1st of 2023 is part of the previous year's last week:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlDateIsoWeekYear1
    @EXAMPLE_AQL{aqlDateIsoWeekYear1}
      RETURN DATE_ISOWEEKYEAR("2023-01-01")
    @END_EXAMPLE_AQL
    @endDocuBlock aqlDateIsoWeekYear1
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

The last two days of 2019 are part of the next year's first week:

    {% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlDateIsoWeekYear2
    @EXAMPLE_AQL{aqlDateIsoWeekYear2}
      RETURN DATE_ISOWEEKYEAR("2019-12-30")
    @END_EXAMPLE_AQL
    @endDocuBlock aqlDateIsoWeekYear2
    {% endaqlexample %}
    {% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_LEAPYEAR()

`DATE_LEAPYEAR(date) → leapYear`

Return whether *date* is in a leap year.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **leapYear** (bool): *true* if *date* is in a leap year, *false* otherwise

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datelpyr1
  @EXAMPLE_AQL{datelpyr1}
    RETURN DATE_LEAPYEAR("2020-01-01")
  @END_EXAMPLE_AQL
  @endDocuBlock datelpyr1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datelpyr2
  @EXAMPLE_AQL{datelpyr2}
    RETURN DATE_LEAPYEAR("2021-01-01")
  @END_EXAMPLE_AQL
  @endDocuBlock datelpyr2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_QUARTER()

`DATE_QUARTER(date) → quarter`

Return which quarter *date* belongs to.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **quarter** (number): the quarter of the given date (1-based):
  - 1 – January, February, March
  - 2 – April, May, June
  - 3 – July, August, September
  - 4 – October, November, December

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline dateqtr1
  @EXAMPLE_AQL{dateqtr1}
    RETURN DATE_QUARTER("2020-08-29")
  @END_EXAMPLE_AQL
  @endDocuBlock dateqtr1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_DAYS_IN_MONTH()

Return the number of days in the month of *date*.

`DATE_DAYS_IN_MONTH(date) → daysInMonth`

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- returns **daysInMonth** (number): the number of days in *date*'s month (28..31)

**Examples**

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedysmn1
  @EXAMPLE_AQL{datedysmn1}
    RETURN DATE_DAYS_IN_MONTH("2020-08-01")
  @END_EXAMPLE_AQL
  @endDocuBlock datedysmn1
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}  

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedysmn2
  @EXAMPLE_AQL{datedysmn2}
    RETURN DATE_DAYS_IN_MONTH("2020-09-01")
  @END_EXAMPLE_AQL
  @endDocuBlock datedysmn2
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedysmn3
  @EXAMPLE_AQL{datedysmn3}
    RETURN DATE_DAYS_IN_MONTH("2020-02-01")
  @END_EXAMPLE_AQL
  @endDocuBlock datedysmn3
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
  @startDocuBlockInline datedysmn4
  @EXAMPLE_AQL{datedysmn4}
    RETURN DATE_DAYS_IN_MONTH("2021-02-01")
  @END_EXAMPLE_AQL
  @endDocuBlock datedysmn4
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_TRUNC()

`DATE_TRUNC(date, unit) → isoDate`

Truncates the given date after *unit* and returns the modified date.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **unit** (string): either of the following to specify the time unit (case-insensitive):
  - y, year, years
  - m, month, months
  - d, day, days
  - h, hour, hours
  - i, minute, minutes
  - s, second, seconds
  - f, millisecond, milliseconds
- returns **isoDate** (string): the truncated ISO 8601 date time string

```aql
DATE_TRUNC('2017-02-03', 'month') // 2017-02-01T00:00:00.000Z
DATE_TRUNC('2017-02-03 04:05:06', 'hours') // 2017-02-03 04:00:00.000Z
```

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline dateTruncGroup
    @EXAMPLE_AQL{dateTruncGroup}
    RETURN MERGE(
      FOR doc IN @data
        COLLECT q = DATE_TRUNC(doc.date, "year") INTO bucket
        RETURN { [DATE_YEAR(q)]: bucket[*].doc.value }
    )
    @BV {
    "data": [
      { "date": "2018-03-05", "value": "Spring" },
      { "date": "2018-07-11", "value": "Summer" },
      { "date": "2018-10-26", "value": "Autumn" },
      { "date": "2019-01-09", "value": "Winter" },
      { "date": "2019-04-02", "value": "Spring" }
    ]
    }
    @END_EXAMPLE_AQL
    @endDocuBlock dateTruncGroup
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_ROUND()

<small>Introduced in: v3.6.0</small>

`DATE_ROUND(date, amount, unit) → isoDate`

Bin a date/time into a set of equal-distance buckets, to be used for
grouping.

- **date** (string\|number): a date string or timestamp
- **amount** (number): number of *unit*s. Must be a positive integer value.
- **unit** (string): either of the following to specify the time unit (case-insensitive):
  - d, day, days
  - h, hour, hours
  - i, minute, minutes
  - s, second, seconds
  - f, millisecond, milliseconds
- returns **isoDate** (string): the rounded ISO 8601 date time string

```aql
DATE_ROUND('2000-04-28T11:11:11.111Z', 1, 'day') // 2000-04-28T00:00:00.000Z
DATE_ROUND('2000-04-10T11:39:29Z', 15, 'minutes') // 2000-04-10T11:30:00.000Z
```

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline dateRoundAggregate
    @EXAMPLE_AQL{dateRoundAggregate}
    FOR doc IN @sensorData
      COLLECT
        date = DATE_ROUND(doc.timestamp, 5, "minutes")
      AGGREGATE
        count = COUNT(1),
        avg = AVG(doc.temp),
        min = MIN(doc.temp),
        max = MAX(doc.temp)
      RETURN { date, count, avg, min, max }
    @BV {
    "sensorData": [
      { "timestamp": "2019-12-04T21:17:52.583Z", "temp": 20.6 },
      { "timestamp": "2019-12-04T21:19:53.516Z", "temp": 20.2 },
      { "timestamp": "2019-12-04T21:21:53.610Z", "temp": 19.9 },
      { "timestamp": "2019-12-04T21:23:52.522Z", "temp": 19.8 },
      { "timestamp": "2019-12-04T21:25:52.988Z", "temp": 19.8 },
      { "timestamp": "2019-12-04T21:27:54.005Z", "temp": 19.7 }
    ]
    }
    @END_EXAMPLE_AQL
    @endDocuBlock dateRoundAggregate
{% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_FORMAT()

`DATE_FORMAT(date, format) → str`

Format a date according to the given format string.

- **date** (string\|number): a date string or timestamp
- **format** (string): a format string, see below
- returns **str** (string): a formatted date string

*format* supports the following placeholders (case-insensitive):

- %t – timestamp, in milliseconds since midnight 1970-01-01
- %z – ISO date (0000-00-00T00:00:00.000Z)
- %w – day of week (0..6)
- %y – year (0..9999)
- %yy – year (00..99), abbreviated (last two digits)
- %yyyy – year (0000..9999), padded to length of 4
- %yyyyyy – year (-009999 .. +009999), with sign prefix and padded to length of 6
- %m – month (1..12)
- %mm – month (01..12), padded to length of 2
- %d – day (1..31)
- %dd – day (01..31), padded to length of 2
- %h – hour (0..23)
- %hh – hour (00..23), padded to length of 2
- %i – minute (0..59)
- %ii – minute (00..59), padded to length of 2
- %s – second (0..59)
- %ss – second (00..59), padded to length of 2
- %f – millisecond (0..999)
- %fff – millisecond (000..999), padded to length of 3
- %x – day of year (1..366)
- %xxx – day of year (001..366), padded to length of 3
- %k – ISO week year number (1..53)
- %kk – ISO week year number (01..53), padded to length of 2
- %l – leap year (0 or 1)
- %q – quarter (1..4)
- %a – days in month (28..31)
- %mmm – abbreviated English name of month (Jan..Dec)
- %mmmm – English name of month (January..December)
- %www – abbreviated English name of weekday (Sun..Sat)
- %wwww – English name of weekday (Sunday..Saturday)
- %& – special escape sequence for rare occasions
- %% – literal %
- % – ignored

`%yyyy` does not enforce a length of 4 for years before 0 and past 9999.
The same format as for `%yyyyyy` will be used instead. `%yy` preserves the
sign for negative years and may thus return 3 characters in total.

Single `%` characters will be ignored. Use `%%` for a literal `%`. To resolve
ambiguities like in `%mmonth` (unpadded month number + the string "month")
between `%mm` + "onth" and `%m` + "month", use the escape sequence `%&`:
`%m%&month`.

Note that *DATE_FORMAT()* is a rather costly operation and may not be suitable for large
datasets (like over 1 million dates). If possible, avoid formatting dates on
server-side and leave it up to the client to do so. This function should only
be used for special date comparisons or to store the formatted dates in the
database. For better performance, use the primitive `DATE_*()` functions
together with `CONCAT()` if possible.

Examples:

```aql
DATE_FORMAT(DATE_NOW(), "%q/%yyyy") // quarter and year (e.g. "3/2015")
DATE_FORMAT(DATE_NOW(), "%dd.%mm.%yyyy %hh:%ii:%ss,%fff") // e.g. "18.09.2015 15:30:49,374"
DATE_FORMAT("1969", "Summer of '%yy") // "Summer of '69"
DATE_FORMAT("2016", "%%l = %l") // "%l = 1" (2016 is a leap year)
DATE_FORMAT("2016-03-01", "%xxx%") // "063", trailing % ignored
```

Comparison and calculation
--------------------------

### DATE_ADD()

`DATE_ADD(date, amount, unit) → isoDate`

Add *amount* given in *unit* to *date* and return the calculated date.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **amount** (number\|string): number of *unit*s to add (positive value) or
  subtract (negative value). It is recommended to use positive values only,
  and use [DATE_SUBTRACT()](#date_subtract) for subtractions instead.
- **unit** (string): either of the following to specify the time unit to add or
  subtract (case-insensitive):
  - y, year, years
  - m, month, months
  - w, week, weeks
  - d, day, days
  - h, hour, hours
  - i, minute, minutes
  - s, second, seconds
  - f, millisecond, milliseconds
- returns **isoDate** (string): the calculated ISO 8601 date time string

```aql
DATE_ADD(DATE_NOW(), -1, "day") // yesterday; also see DATE_SUBTRACT()
DATE_ADD(DATE_NOW(), 3, "months") // in three months
DATE_ADD(DATE_ADD("2015-04-01", 5, "years"), 1, "month") // May 1st 2020
DATE_ADD("2015-04-01", 12*5 + 1, "months") // also May 1st 2020
DATE_ADD(DATE_TIMESTAMP(DATE_YEAR(DATE_NOW()), 12, 24), -4, "years") // Christmas four years ago
DATE_ADD(DATE_ADD("2016-02", "month", 1), -1, "day") // last day of February (29th, because 2016 is a leap year!)
```

---

`DATE_ADD(date, isoDuration) → isoDate`

You may also pass an ISO duration string as *amount* and leave out *unit*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **isoDuration** (string): an ISO 8601 duration string to add to *date*, see below
- returns **isoDate** (string):  the calculated ISO 8601 date time string

The format is `P_Y_M_W_DT_H_M_._S`, where underscores stand for digits and
letters for time intervals - except for the separators `P` (period) and `T` (time).
The meaning of the other letters are:
- Y – years
- M – months (if before T)
- W – weeks
- D – days
- H – hours
- M – minutes (if after T)
- S – seconds (optionally with 3 decimal places for milliseconds)

The string must be prefixed by a `P`. A separating `T` is only required if
`H`, `M` and/or `S` are specified. You only need to specify the needed pairs
of letters and numbers.

```aql
DATE_ADD(DATE_NOW(), "P1Y") // add 1 year
DATE_ADD(DATE_NOW(), "P3M2W") // add 3 months and 2 weeks
DATE_ADD(DATE_NOW(), "P5DT26H") // add 5 days and 26 hours (=6 days and 2 hours)
DATE_ADD("2000-01-01", "PT4H") // add 4 hours
DATE_ADD("2000-01-01", "PT30M44.4S" // add 30 minutes, 44 seconds and 400 ms
DATE_ADD("2000-01-01", "P1Y2M3W4DT5H6M7.89S" // add a bit of everything
```

### DATE_SUBTRACT()

`DATE_SUBTRACT(date, amount, unit) → isoDate`

Subtract *amount* given in *unit* from *date* and return the calculated date.

It works the same as [DATE_ADD()](#date_add), except that it subtracts. It is
equivalent to calling *DATE_ADD()* with a negative amount, except that
*DATE_SUBTRACT()* can also subtract ISO durations. Note that negative ISO
durations are not supported (i.e. starting with `-P`, like `-P1Y`).

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **amount** (number\|string): number of *unit*s to subtract (positive value) or
  add (negative value). It is recommended to use positive values only,
  and use [DATE_ADD()](#date_add) for additions instead.
- **unit** (string): either of the following to specify the time unit to add or
  subtract (case-insensitive):
  - y, year, years
  - m, month, months
  - w, week, weeks
  - d, day, days
  - h, hour, hours
  - i, minute, minutes
  - s, second, seconds
  - f, millisecond, milliseconds
- returns **isoDate** (string): the calculated ISO 8601 date time string

---

`DATE_SUBTRACT(date, isoDuration) → isoDate`

You may also pass an ISO duration string as *amount* and leave out *unit*.

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **isoDuration** (string): an ISO 8601 duration string to subtract from *date*,
  see below
- returns **isoDate** (string): the calculated ISO 8601 date time string

The format is `P_Y_M_W_DT_H_M_._S`, where underscores stand for digits and
letters for time intervals - except for the separators `P` (period) and `T` (time).
The meaning of the other letters are:
- Y – years
- M – months (if before T)
- W – weeks
- D – days
- H – hours
- M – minutes (if after T)
- S – seconds (optionally with 3 decimal places for milliseconds)

The string must be prefixed by a `P`. A separating `T` is only required if
`H`, `M` and/or `S` are specified. You only need to specify the needed pairs
of letters and numbers.

```aql
DATE_SUBTRACT(DATE_NOW(), 1, "day") // yesterday
DATE_SUBTRACT(DATE_TIMESTAMP(DATE_YEAR(DATE_NOW()), 12, 24), 4, "years") // Christmas four years ago
DATE_SUBTRACT(DATE_ADD("2016-02", "month", 1), 1, "day") // last day of February (29th, because 2016 is a leap year!)
DATE_SUBTRACT(DATE_NOW(), "P4D") // four days ago
DATE_SUBTRACT(DATE_NOW(), "PT1H3M") // 1 hour and 30 minutes ago
```

### DATE_DIFF()

`DATE_DIFF(date1, date2, unit, asFloat) → diff`

Calculate the difference between two dates in given time *unit*, optionally
with decimal places.

- **date1** (number\|string): numeric timestamp or ISO 8601 date time string
- **date2** (number\|string): numeric timestamp or ISO 8601 date time string
- **unit** (string): either of the following to specify the time unit to return the
  difference in (case-insensitive):
  - y, year, years
  - m, month, months
  - w, week, weeks
  - d, day, days
  - h, hour, hours
  - i, minute, minutes
  - s, second, seconds
  - f, millisecond, milliseconds
- **asFloat** (boolean, *optional*): if set to *true*, decimal places will be
  preserved in the result. The default is *false* and an integer is returned.
- returns **diff** (number): the calculated difference as number in *unit*.
  The value will be negative if *date2* is before *date1*.

### DATE_COMPARE()

`DATE_COMPARE(date1, date2, unitRangeStart, unitRangeEnd) → bool`

Check if two partial dates match.

- **date1** (number\|string): numeric timestamp or ISO 8601 date time string
- **date2** (number\|string): numeric timestamp or ISO 8601 date time string
- **unitRangeStart** (string): unit to start from, see below
- **unitRangeEnd** (string, *optional*):  unit to end with, leave out to only
  compare the component as specified by *unitRangeStart*. An error is raised if
  *unitRangeEnd* is a unit before *unitRangeStart*.
- returns **bool** (bool): *true* if the dates match, *false* otherwise

The parts to compare are defined by a range of time units. The full range is:
years, months, days, hours, minutes, seconds, milliseconds (in this order).

All components of *date1* and *date2* as specified by the range will be compared.
You can refer to the units as:

- y, year, years
- m, month, months
- d, day, days
- h, hour, hours
- i, minute, minutes
- s, second, seconds
- f, millisecond, milliseconds

```aql
// Compare months and days, true on birthdays if you're born on 4th of April
DATE_COMPARE("1985-04-04", DATE_NOW(), "months", "days")

// Will only match on one day if the current year is a leap year!
// You may want to add or subtract one day from date1 to match every year.
DATE_COMPARE("1984-02-29", DATE_NOW(), "months", "days")

// compare years, months and days (true, because it's the same day)
DATE_COMPARE("2001-01-01T15:30:45.678Z", "2001-01-01T08:08:08.008Z", "years", "days")
```

You can directly compare ISO date **strings** if you want to find dates before or
after a certain date, or in between two dates (`>=`, `>`, `<`, `<=`).
No special date function is required. Equality tests (`==` and `!=`) will only
match the exact same date and time however. You may use `SUBSTRING()` to
compare partial date strings, `DATE_COMPARE()` is basically a convenience
function for that. However, neither is really required to limit a search to a
certain day as demonstrated here:

```aql
FOR doc IN coll
    FILTER doc.date >= "2015-05-15" AND doc.date < "2015-05-16"
    RETURN doc
```

Every ISO date on that day is greater than or equal to `2015-05-15` in a string
comparison (e.g. `2015-05-15T11:30:00.000Z`). Dates before `2015-05-15` are smaller
and therefore filtered out by the first condition. Every date past `2015-05-15` is
greater than this date in a string comparison, and therefore filtered out by the
second condition. The result is that the time components in the dates you compare
with are "ignored". The query will return every document with *date* ranging from
`2015-05-15T00:00:00.000Z` to `2015-05-15T23:99:99.999Z`. It would also include
`2015-05-15T24:00:00.000Z`, but that date is actually `2015-05-16T00:00:00.000Z`
and can only occur if inserted manually (you may want to pass dates through
[DATE_ISO8601()](#date_iso8601) to ensure a correct date representation).

Leap days in leap years (29th of February) must be always handled manually,
if you require so (e.g. birthday checks):

```aql
LET today = DATE_NOW()
LET noLeapYear = NOT DATE_LEAPYEAR(today)

FOR user IN users
    LET birthday = noLeapYear AND
                   DATE_MONTH(user.birthday) == 2 AND
                   DATE_DAY(user.birthday) == 29
                   ? DATE_SUBTRACT(user.birthday, 1, "day") /* treat like 28th in non-leap years */
                   : user.birthday
    FILTER DATE_COMPARE(today, birthday, "month", "day")
    /* includes leaplings on the 28th of February in non-leap years,
     * but excludes them in leap years which do have a 29th February.
     * Replace DATE_SUBTRACT() by DATE_ADD() to include them on the 1st of March
     * in non-leap years instead (depends on local jurisdiction).
     */
    RETURN user
```

### DATE_UTCTOLOCAL()

<small>Introduced in: v3.8.0</small>

Converts *date* assumed in Zulu time (UTC) to local *timezone*.

It takes historic daylight saving times into account.

`DATE_UTCTOLOCAL(date, timezone, zoneinfo) → date`

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **timezone** (string):
  [IANA timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones){:target="_blank"},
  e.g. `"America/New_York"`, `"Europe/Berlin"` or `"UTC"`.
  Use `"America/Los_Angeles"` for Pacific time (PST/PDT).
  Will throw an error if the timezone is not known to ArangoDB
- **zoneinfo** (boolean, *optional*): if set to *true*, an object with timezone
  information is returned. The default is *false* and a date string is returned
- returns **date** (string\|object): an ISO 8601 date time string in
  unqualified local time, or an object with the following attributes:
  - **local** (string): ISO 8601 date time string in unqualified local time
  - **tzdb** (string): version of the timezone database used (e.g. `"2020f"`)
  - **zoneInfo**: (object): timezone information
    - **name** (string): timezone abbreviation (GMT, PST, CET, ...)
    - **begin** (string\|null): begin of the timezone effect as UTC date time string
    - **end** (string\|null): end of the timezone effect as UTC date time string
    - **dst** (boolean): *true* when daylight saving time (DST) is active,
      *false* otherwise
    - **offset** (number): offset to UTC in seconds

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlDateTimeToLocal_1
    @EXAMPLE_AQL{aqlDateTimeToLocal_1}
    RETURN [
      DATE_UTCTOLOCAL("2020-03-15T00:00:00.000", "Europe/Berlin"),
      DATE_UTCTOLOCAL("2020-03-15T00:00:00.000", "America/New_York"),
      DATE_UTCTOLOCAL("2020-03-15T00:00:00.000", "UTC")
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlDateTimeToLocal_1
    {% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlDateTimeToLocal_2
    @EXAMPLE_AQL{aqlDateTimeToLocal_2}
    RETURN [
      DATE_UTCTOLOCAL("2020-03-15T00:00:00.000", "Asia/Shanghai"),
      DATE_UTCTOLOCAL("2020-03-15T00:00:00.000Z", "Asia/Shanghai"),
      DATE_UTCTOLOCAL("2020-03-15T00:00:00.000-02:00", "Asia/Shanghai"),
      DATE_UTCTOLOCAL(1584230400000, "Asia/Shanghai")
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlDateTimeToLocal_2
    {% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlDateTimeToLocal_3
    @EXAMPLE_AQL{aqlDateTimeToLocal_3}
    RETURN DATE_UTCTOLOCAL(DATE_NOW(), "Africa/Lagos", true)
    @END_EXAMPLE_AQL
    @endDocuBlock aqlDateTimeToLocal_3
    {% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_LOCALTOUTC()

<small>Introduced in: v3.8.0</small>

Converts *date* assumed in local *timezone* to Zulu time (UTC).

It takes historic daylight saving times into account.

`DATE_LOCALTOUTC(date, timezone, zoneinfo) → date`

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **timezone** (string):
  [IANA timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones){:target="_blank"},
  e.g. `"America/New_York"`, `"Europe/Berlin"` or `"UTC"`.
  Use `"America/Los_Angeles"` for Pacific time (PST/PDT).
  Will throw an error if the timezone is not known to ArangoDB
- **zoneinfo** (boolean, *optional*): if set to *true*, an object with timezone
  information is returned. The default is *false* and a date string is returned
- returns **date** (string\|object): an ISO 8601 date time string in
  Zulu time (UTC), or an object with the following attributes:
  - **utc** (string): ISO 8601 date time string in Zulu time (UTC)
  - **tzdb** (string): version of the timezone database used (e.g. `"2020f"`)
  - **zoneInfo**: (object): timezone information
    - **name** (string): timezone abbreviation (GMT, PST, CET, ...)
    - **begin** (string\|null): begin of the timezone effect as UTC date time string
    - **end** (string\|null): end of the timezone effect as UTC date time string
    - **dst** (boolean): *true* when daylight saving time (DST) is active,
      *false* otherwise
    - **offset** (number): offset to UTC in seconds

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlDateTimeToUTC_1
    @EXAMPLE_AQL{aqlDateTimeToUTC_1}
    RETURN [
      DATE_LOCALTOUTC("2020-03-15T00:00:00.000", "Europe/Berlin"),
      DATE_LOCALTOUTC("2020-03-15T00:00:00.000", "America/New_York"),
      DATE_LOCALTOUTC("2020-03-15T00:00:00.000", "UTC")
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlDateTimeToUTC_1
    {% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlDateTimeToUTC_2
    @EXAMPLE_AQL{aqlDateTimeToUTC_2}
    RETURN [
      DATE_LOCALTOUTC("2020-03-15T00:00:00.000", "Asia/Shanghai"),
      DATE_LOCALTOUTC("2020-03-15T00:00:00.000Z", "Asia/Shanghai"),
      DATE_LOCALTOUTC("2020-03-15T00:00:00.000-02:00", "Asia/Shanghai"),
      DATE_LOCALTOUTC(1584230400000, "Asia/Shanghai")
    ]
    @END_EXAMPLE_AQL
    @endDocuBlock aqlDateTimeToUTC_2
    {% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

{% aqlexample examplevar="examplevar" type="type" query="query" bind="bind" result="result" %}
    @startDocuBlockInline aqlDateTimeToUTC_3
    @EXAMPLE_AQL{aqlDateTimeToUTC_3}
    RETURN DATE_LOCALTOUTC("2021-03-16T12:00:00.000", "Africa/Lagos", true)
    @END_EXAMPLE_AQL
    @endDocuBlock aqlDateTimeToUTC_3
    {% endaqlexample %}
{% include aqlexample.html id=examplevar type=type query=query bind=bind result=result %}

### DATE_TIMEZONE()

<small>Introduced in: v3.8.0</small>

Returns system timezone ArangoDB is running on.

For cloud servers this will most likely be "Etc/UTC".

`DATE_TIMEZONE() → timezone`

- returns **timezone** (string):
  [IANA timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones){:target="_blank"}
  of the server timezone.

### DATE_TIMEZONES()

<small>Introduced in: v3.8.0</small>

Returns all valid timezone names.

`DATE_TIMEZONES() → timezones`

- returns **timezones** (array): an array of
  [IANA timezone names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones){:target="_blank"}

Working with dates and indices
------------------------------

There are two recommended ways to store timestamps in ArangoDB:
  - string: UTC timestamp with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601){:target="_blank"}
  - number: [unix timestamp](https://en.wikipedia.org/wiki/Unix_time){:target="_blank"} with millisecond precision

The sort order of both is identical due to the sort properties of ISO date strings.
You can't mix both types, numbers and strings, in a single attribute however.

You can use [persistent indices](../indexing-persistent.html) with both date types.
When choosing string representations, you can work with string comparisons (less than,
greater than etc.) to express time ranges in your queries while still utilizing
persistent indices:

{% arangoshexample examplevar="examplevar" script="script" result="result" %}
    @startDocuBlockInline working_with_date_time
    @EXAMPLE_ARANGOSH_OUTPUT{working_with_date_time}
    db._create("exampleTime");
    var timestamps = ["2014-05-07T14:19:09.522","2014-05-07T21:19:09.522","2014-05-08T04:19:09.522","2014-05-08T11:19:09.522","2014-05-08T18:19:09.522"];
    for (i = 0; i < 5; i++) db.exampleTime.save({value:i, ts: timestamps[i]})
    db._query("FOR d IN exampleTime FILTER d.ts > '2014-05-07T14:19:09.522' and d.ts < '2014-05-08T18:19:09.522' RETURN d").toArray()
    ~addIgnoreCollection("example")
    ~db._drop("exampleTime")
    @END_EXAMPLE_ARANGOSH_OUTPUT
    @endDocuBlock working_with_date_time
{% endarangoshexample %}
{% include arangoshexample.html id=examplevar script=script result=result %}

The first and the last timestamp in the array are excluded from the result by the `FILTER`.

Limitations
-----------

Note that dates before the year 1583 aren't allowed by the
[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601){:target="_blank"} standard by default, because
they lie before the official introduction of the Gregorian calendar and may thus
be incorrect or invalid. All AQL date functions apply the same rules to every
date according to the Gregorian calendar system, even if inappropriate. That
does not constitute a problem, unless you deal with dates prior to 1583 and
especially years before Christ. The standard allows negative years, but requires
special treatment of positive years too, if negative years are used (e.g.
`+002015-05-15` and `-000753-01-01`). This is rarely used however, and AQL does
not use the 7-character version for years between 0 and 9999 in ISO strings.
Keep in mind that they can't be properly compared to dates outside that range.
Sorting of negative dates does not result in a meaningful order, with years longer
ago last, but months, days and the time components in otherwise correct order.

Leap seconds are ignored, just as they are in JavaScript as per
[ECMAScript Language Specifications](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.1){:target="_blank"}.
