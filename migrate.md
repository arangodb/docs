# Migration

## Prerequisites

- Python 3
- `yaml` module
  ```
  python3 -m pip install pyyaml
  ```

## Migrate

**Create a backup copy of the docs repository first**

Make sure the **docs/site/content** and **docs/site/assets/images/** folders are empty.

Launch
```
python3 migration.py --src {oldToolchainPath} --dst {newToolchainPath}
```

Make sure provided paths also include the docs/ folder.

Example:

```
python3 migration.py --src /work/projects/old-arango-docs/docs --dst /work/projects/arangodb/docs
```