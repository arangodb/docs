---
fileID: functions-bit
title: Bit functions
weight: 3615
description: 
layout: default
---
`BIT_XOR(value1, value2) → result`

If two numbers are passed as individual function parameters to `BIT_XOR()`, it
will return the bitwise exclusive or value of its two operands. Only numbers in
the range 0 to 2<sup>32</sup> - 1 are allowed as input values.

- **value1** (number): first operand
- **value2** (number): second operand
- returns **result** (number\|null): xor-combined result

{{< tabs >}}
{{% tab name="aql" %}}
```aql
BIT_XOR([1, 4, 8, 16]) // 29
BIT_XOR([3, 7, 63]) // 59
BIT_XOR([255, 127, null, 63]) // 191
BIT_XOR(255, 257) // 510
BIT_XOR("foo") // null
```
{{% /tab %}}
{{< /tabs >}}
