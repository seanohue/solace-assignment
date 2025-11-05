# Discussion

## Meta-commentary

Typically, I would break these changes into more granular pull requests, maybe a chain of PRs.
For sake of time, I will do just a single PR but attempt granular and meaningful working commits within the PR.

Also, I developed this largely on Windows for WSL as I did not initially have access to a Mac (I'm used to using a Mac and Unix for development). As a result, some early commits may have some odd filesystem stuff that I cleaned up later on. 

In addition, I had some changes committed to `main` and in the initial commit prior to branching to a PR. I tried to squash these using `git rebase --root -i` but they may still be somewhat messy.

## First Impressions and Concerns

### Project Install

Noted several packages that had vulnerabilities. Initially, I chose only to upgrade the ones that could be upgraded without breaking the project. This is because I wanted to get the project up and running first, so I could see what the non-broken version looked like before making any breaking changes. (Note: Did not get around to upgrading all packages, only non-breaking ones)

### Running the development server

The Next.js app compiles and builds in under 3 seconds. I'm not familiar enough with Next to know if this is expected or not; it seems acceptable but I know that some small apps with different bundlers such as vite can take under a second to build. 

After the initial build, loading the page seemed to take several seconds so there may be some performance issues there that can be addressed. I may use Lighthouse or a different tool to test the performance and see where bottlenecks are. I will also want to add a loading state here so that it does not appear to be frozen or broken to the user. (Note: Did not get around to doing any major perf profiling here)

### UI/UX issues

My first impression (without looking at the code) is that there is little to no CSS styling being done, and as a result the table is a bit ugly and hard to read (no offense). There is a heading at the top, a search bar that is very plain, and a table with some data. There is also a small error banner at the bottom though it does not indicate what the error is.

In terms of the initial appearance of the app, my goals are:
1. Style the heading and search bar in a way that at least vaguely resembles the design of the main Solace Health website. 
  a. In a real-world setting I would partner with a designer to get the style guide, etc.
  b. This will also include addressing any accesisbility issues with the search/heading.
2. Get the search functionality to work correctly. Currently it seems to do nothing, but it does increment the error count in the banner.
  a. The error is due to calling `.includes` on years of experience, which is likely a number. I will need to convert the number to a string and then call `.includes` on the string.
  b. In terms of UX, it may not make sense to have both a search-on-type _and_ a search button. I may just remove the update on type and just have a search button.
3. Style the table in a way that makes it more readable and visually appealing.
  a. I will also want to ensure the table is accessible to screen reader users.
  b. The phone number column should be formatted as a phone number.
4. See what error is occuring as indicated by the banner, fixing the error if it is a developer error, and also exposing any errors that are able to be addressed by the user in a way that is more user-friendly.
  a. I also want the error banner to be accessible, esp. assuming it is something that would show in production.
  b. The initial render error is `In HTML, <th> cannot be a child of <thead>. This will cause a hydration error.` I'll need to fix the template, most likely.
5. Then I can address some nice-to-haves. For example, columns of the table should be sortable, and perhaps there could be a way to filter the table by certain criteria as well.
  a. It might be nice to be able to "Search by _____" instead of a text search of all columns.


### Full-stack concerns

For UI/UX reasons and performance reasons, it would be nice to have the data filtered on the server side, and paginated.

### FE Code Quality Issues

On looking at the code, I noticed a few issues.
1. The entire frontend page is a single component. Best practice would be to make it more modular as needed.
2. The search function seems to use DOM APIs in an unusual way rather than using React features. For example, updating an element on the page with a search term and then querying the DOM to get the search term to use it to filter the data. I would use React state.
3. `<br /> tags are used in the template for line breaks and styling. This should be avoided and CSS/Tailwind can be used to add padding, gaps or margin where desired.

## Tracking the Work

### Checklist:
- [x] Style the heading
- [x] Style the search bar
- [x] Remove line breaks and console logs.
- [x] Get the search functionality to work correctly, using React state.
- [x] Fix the search `.includes` error.
- [x] Enable search when pressing enter on input field
- [x] The initial render error is `In HTML, <th> cannot be a child of <thead>. This will cause a hydration error.` I'll need to fix the template, most likely.
- [x] Search label should use `<label>` tag and be associated with the input field.
- [x] Enable pagination full-stack
- [x] Format phone number
- [x] Enable search by specialty
- [x] Enable search by city
- [x] Sort by last name by default
- [x] Enable filtering by degree
- [x] Enable filtering by years of experience
- [x] Style the table in a way that makes it more readable and visually appealing.
- [ ] Componentize the page.tsx file where it makes sense to do so.
- [ ] Address any other accessibility issues.
- [ ] Pagination, search and filtering should be represented in the URL potentially, or there could be a way to have a permalink to a specific page of results.
- [ ] Ideally there are unit/integration tests for the frontend and backend.

## Conclusion

I did not get to all of the UI/UX improvements I would have liked, nor did I address perf, accessibility, or tech debt besides some minor pagination and form improvements. There is a lot to be done here, such as bringing in a form library, adding tests, etc.

That said, this was a good way to spend 2+ hours, I practiced Pomodoro quite a bit, and learned a little more about Tailwind and Next.js. I'm happy with the progress I made and I'm looking forward to hearing back from the team at Solace!
