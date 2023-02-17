{{ include.version | is_set: "include.version" -}}
{% assign metrics = include.version | remove: "." | append: "-allMetrics" -%}
{{ site.data | has_key: metrics, "site.data" -}}
{% assign groups = site.data[metrics] | group_by:"category" -%}
{% for group in groups -%}
### {{ group.name }}

{% for metric in group.items -%}
#### {{ metric.help }} {: #{{ metric.name }} }

`{{ metric.name }}`

{{ metric.description }}

{% if metric.introducedIn or metric.renamedFrom -%}
<small>
{%- if metric.introducedIn %}Introduced in: v{{ metric.introducedIn }}{% endif -%}
{% if metric.introducedIn and metric.renamedFrom -%}. {% endif -%}
{% if metric.renamedFrom -%}Renamed from: `{{ metric.renamedFrom }}`{% endif -%}
</small>
{%- endif %}

| Type | Unit | Complexity | Exposed by |
|:-----|:-----|:-----------|:-----------|
| {{ metric.type }} | {{ metric.unit }} | {{ metric.complexity }} | {{ metric.exposedBy | capitalize_components | join_natural }} |

{% if metric.threshold -%}
**Threshold:**
{{ metric.threshold }}
{% endif -%}

{% if metric.troubleshoot -%}
**Troubleshoot:**
{{ metric.troubleshoot }}
{% endif -%}

{% if forloop.last %}{% else %}
---
{% endif -%}

{% endfor -%}
{% endfor -%}
