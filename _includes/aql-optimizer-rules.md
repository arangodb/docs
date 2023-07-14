{% assign rules=include.options -%}
{% for rule in rules -%}
{% if rule.flags.hidden == false -%}
#### `{{ rule.name }}`

{% if rule.flags.enterpriseOnly -%}
_Enterprise Edition only_
{% endif %}

{% if rule.flags.disabledByDefault -%}
This rule is disabled by default.
{% endif %}

{% if rule.flags.canBeDisabled == false -%}
This rule cannot be turned off.
{% endif %}

{% if rule.flags.clusterOnly -%}
Only available in cluster deployments.
{% endif %}

{{ rule.description }}

{% if forloop.last %}{% else %}
---
{% endif -%}

{% endif -%}
{% endfor -%}
