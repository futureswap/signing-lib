# signing-lib

## To use

- Clone repository
- Run `yarn link` in the base directory. It will print out the package name
- Run `yarn link "package-name"` in the project you want to use this module with

## To edit

- Edit or add files to src
- Run `yarn build` to compile to lib once.
- Run `yarn dev` to compile to lib when a file is changed
- If stuck, look into /build to see the code that's being generated. Sometimes deleting /lib and building the project again helps.
