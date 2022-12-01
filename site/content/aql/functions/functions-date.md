---
fileID: functions-date
title: Date functions
weight: 3705
description: 
layout: default
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

{{< tabs >}}
{{% tab name="aql" %}}
```aql
DATE_SUBTRACT(DATE_NOW(), 1, "day") // yesterday
DATE_SUBTRACT(DATE_TIMESTAMP(DATE_YEAR(DATE_NOW()), 12, 24), 4, "years") // Christmas four years ago
DATE_SUBTRACT(DATE_ADD("2016-02", "month", 1), 1, "day") // last day of February (29th, because 2016 is a leap year!)
DATE_SUBTRACT(DATE_NOW(), "P4D") // four days ago
DATE_SUBTRACT(DATE_NOW(), "PT1H3M") // 1 hour and 30 minutes ago
```
{{% /tab %}}
{{< /tabs >}}

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

{{< tabs >}}
{{% tab name="aql" %}}
```aql
// Compare months and days, true on birthdays if you're born on 4th of April
DATE_COMPARE("1985-04-04", DATE_NOW(), "months", "days")

// Will only match on one day if the current year is a leap year!
// You may want to add or subtract one day from date1 to match every year.
DATE_COMPARE("1984-02-29", DATE_NOW(), "months", "days")

// compare years, months and days (true, because it's the same day)
DATE_COMPARE("2001-01-01T15:30:45.678Z", "2001-01-01T08:08:08.008Z", "years", "days")
```
{{% /tab %}}
{{< /tabs >}}

You can directly compare ISO date **strings** if you want to find dates before or
after a certain date, or in between two dates (`>=`, `>`, `<`, `<=`).
No special date function is required. Equality tests (`==` and `!=`) will only
match the exact same date and time however. You may use `SUBSTRING()` to
compare partial date strings, `DATE_COMPARE()` is basically a convenience
function for that. However, neither is really required to limit a search to a
certain day as demonstrated here:

{{< tabs >}}
{{% tab name="aql" %}}
```aql
FOR doc IN coll
    FILTER doc.date >= "2015-05-15" AND doc.date < "2015-05-16"
    RETURN doc
```
{{% /tab %}}
{{< /tabs >}}

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

{{< tabs >}}
{{% tab name="aql" %}}
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
{{% /tab %}}
{{< /tabs >}}

### DATE_UTCTOLOCAL()

<small>Introduced in: v3.8.0</small>

Converts *date* assumed in Zulu time (UTC) to local *timezone*.

It takes historic daylight saving times into account.

`DATE_UTCTOLOCAL(date, timezone, zoneinfo) → date`

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **timezone** (string):
  [IANA timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones),
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


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlDateTimeToLocal_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN [
  DATE_UTCTOLOCAL("2020-03-15T00:00:00.000", "Europe/Berlin"),
  DATE_UTCTOLOCAL("2020-03-15T00:00:00.000", "America/New_York"),
  DATE_UTCTOLOCAL("2020-03-15T00:00:00.000", "UTC")
]
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    



 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlDateTimeToLocal_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN [
  DATE_UTCTOLOCAL("2020-03-15T00:00:00.000", "Asia/Shanghai"),
  DATE_UTCTOLOCAL("2020-03-15T00:00:00.000Z", "Asia/Shanghai"),
  DATE_UTCTOLOCAL("2020-03-15T00:00:00.000-02:00", "Asia/Shanghai"),
  DATE_UTCTOLOCAL(1584230400000, "Asia/Shanghai")
]
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    



 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlDateTimeToLocal_3
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN DATE_UTCTOLOCAL(DATE_NOW(), "Africa/Lagos", true)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    


### DATE_LOCALTOUTC()

<small>Introduced in: v3.8.0</small>

Converts *date* assumed in local *timezone* to Zulu time (UTC).

It takes historic daylight saving times into account.

`DATE_LOCALTOUTC(date, timezone, zoneinfo) → date`

- **date** (number\|string): numeric timestamp or ISO 8601 date time string
- **timezone** (string):
  [IANA timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones),
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


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlDateTimeToUTC_1
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN [
  DATE_LOCALTOUTC("2020-03-15T00:00:00.000", "Europe/Berlin"),
  DATE_LOCALTOUTC("2020-03-15T00:00:00.000", "America/New_York"),
  DATE_LOCALTOUTC("2020-03-15T00:00:00.000", "UTC")
]
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    



 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlDateTimeToUTC_2
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN [
  DATE_LOCALTOUTC("2020-03-15T00:00:00.000", "Asia/Shanghai"),
  DATE_LOCALTOUTC("2020-03-15T00:00:00.000Z", "Asia/Shanghai"),
  DATE_LOCALTOUTC("2020-03-15T00:00:00.000-02:00", "Asia/Shanghai"),
  DATE_LOCALTOUTC(1584230400000, "Asia/Shanghai")
]
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    



 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="aql" %}}
```aql
---
name: aqlDateTimeToUTC_3
description: ''
render: input/output
version: '3.10'
release: stable
---
RETURN DATE_LOCALTOUTC("2021-03-16T12:00:00.000", "Africa/Lagos", true)
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 
    


### DATE_TIMEZONE()

<small>Introduced in: v3.8.0</small>

Returns system timezone ArangoDB is running on.

For cloud servers this will most likely be "Etc/UTC".

`DATE_TIMEZONE() → timezone`

- returns **timezone** (string):
  [IANA timezone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
  of the server timezone.

### DATE_TIMEZONES()

<small>Introduced in: v3.8.0</small>

Returns all valid timezone names.

`DATE_TIMEZONES() → timezones`

- returns **timezones** (array): an array of
  [IANA timezone names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## Working with dates and indexes

There are two recommended ways to store timestamps in ArangoDB:
  - string: UTC timestamp with [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
  - number: [unix timestamp](https://en.wikipedia.org/wiki/Unix_time) with millisecond precision

The sort order of both is identical due to the sort properties of ISO date strings.
You can't mix both types, numbers and strings, in a single attribute however.

You can use [persistent indexes](../../indexing/working-with-indexes/indexing-persistent) with both date types.
When choosing string representations, you can work with string comparisons (less than,
greater than etc.) to express time ranges in your queries while still utilizing
persistent indexes:


 {{< version "3.10" >}}
{{< tabs >}}
{{% tab name="js" %}}
```js
---
name: working_with_date_time
description: ''
render: input/output
version: '3.10'
release: stable
---
db._create("exampleTime");
var timestamps = ["2014-05-07T14:19:09.522","2014-05-07T21:19:09.522","2014-05-08T04:19:09.522","2014-05-08T11:19:09.522","2014-05-08T18:19:09.522"];
for (i = 0; i < 5; i++) db.exampleTime.save({value:i, ts: timestamps[i]})
db._query("FOR d IN exampleTime FILTER d.ts > '2014-05-07T14:19:09.522' and d.ts < '2014-05-08T18:19:09.522' RETURN d").toArray()
~addIgnoreCollection("example")
~db._drop("exampleTime")
```
{{% /tab %}}
{{< /tabs >}}
{{< /version >}}
 



The first and the last timestamp in the array are excluded from the result by the `FILTER`.

## Limitations

Note that dates before the year 1583 aren't allowed by the
[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard by default, because
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
[ECMAScript Language Specifications](http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.1).
