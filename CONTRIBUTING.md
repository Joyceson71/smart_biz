# Contributing to Smartbiz

First off, thank you for considering contributing to Smartbiz! It's people like you that make Smartbiz such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork Smartbiz and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-graphql-support
```

## Get the test suite running

Make sure you have all the dependencies installed and can run the test suite:

```sh
npm install
npm run test
```

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first :smile_cat:

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Smartbiz's master branch:

```sh
git remote add upstream https://github.com/Joyceson71/smart_biz.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-graphql-support
git rebase master
git push --set-upstream origin 325-add-graphql-support
```

Finally, go to GitHub and make a Pull Request :D

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

## Guidelines

* Follow the existing code style.
* Write clear, descriptive commit messages.
* Add documentation for new features.
* Include tests when adding new features or fixing bugs.
