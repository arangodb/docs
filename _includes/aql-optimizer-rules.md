{% assign rules=include.options -%}
{% for rule in rules -%}
{% if rule.flags.hidden == false -%}
#### `{{ rule.name }}`

{% if rule.flags.enterpriseOnly %}
_Enterprise Edition only_
{% endif %}

{{ rule.description }}

{% if rule.flags.disabledByDefault -%}
This rule is disabled by default.
{% endif %}

{% if rule.flags.canBeDisabled == false -%}
This is not an optimization and cannot be turned off.
{% endif %}

{% if rule.flags.clusterOnly -%}
Only available in cluster deployments.
{% endif %}

{% endif -%}
{% endfor -%}
