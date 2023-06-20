{% assign rules=include.options -%}
{% for rule in rules -%}
{% if rule.hidden == false -%}
#### `{{ rule.name }}`

{% if rule.enterpriseOnly %}
_Enterprise Edition only_
{% endif %}

{{ rule.description }}

{% if rule.disabledByDefault == false %}
Default: enabled
{% endif %}

{% if rule.clusterOnly %}
Only available in cluster deployments.
{% endif %}

{% endif -%}
{% endfor -%}
