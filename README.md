# common trace scanner

## Getting Started

1. Install dependencies using 
```
pnpm install
```

2. Update training data in the directory `log`. Update `index.ts` training data constant `DATASETS`

3. Update the test data in `test_data` and change `TEST_LOG` to point to the log you want to test

4. Run the command to calculate the score
```
pnpm run start
```