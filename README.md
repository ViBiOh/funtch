# funtch

[![Build Status](https://travis-ci.org/ViBiOh/funtch.svg?branch=master)](https://travis-ci.org/ViBiOh/funtch)
[![codecov](https://codecov.io/gh/ViBiOh/funtch/branch/master/graph/badge.svg)](https://codecov.io/gh/ViBiOh/funtch)

# Functional Fetch

## Usage

```
import funtch from 'funtch';

funtch.get('https://api.vibioh.fr/hello/funtch')
  .then(console.log)
```

> {"greeting":"Hello funtch, I'm greeting you from the server!"}