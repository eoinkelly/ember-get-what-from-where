
## Query Params

* sometimes you have a lot of state in the app that doesn't belong in models
* you want query params to be optional - currently requires 2 routes
* some of that state is controller state - doesn't belong in models

Q: can you achieve same thing as query params with controllers alone?
  mabye a controller that stores the relevant state and all others can get at it
  or a service

Ember treats query params as a routing concern
* query params are global!
* ember has more than one route active at a time => the query params will all be mashed together

```javascript

App.Router.map(function () {
  // PostsRoute will not have access to sort, showDetails
  this.resource('posts', {queryParams: ['sort', 'direction']}, function () {
    // The child will have access to child sort, parent direction, child showDetails
    this.route('comments', {queryParams: ['showDetails', 'sort']} );
  });
})

// queryParams are made available to all the route hooks

App.PostsRoute = Ember.Route.extend({
  // These are pretty good naming
  beforeModel: function (queryParams, transition) {}
  model: function (params, queryParams, transition) {}
  afterModel: function (resolvedModel, queryParams, transition) {}
  setupController: function (controller, context, queryParams) {}
  renderTemplate: function (controller, context, queryParams) {}
});


// just pass an object with a queryParams key
this.transitionTo('posts', {queryParams: { sort: 'yes', direction: 'asc'}});
this.transistionTo('posts/1?sort=yes&direction=asc'); // this also works

{{#link-to 'posts' direction=asc}}go to posts{{/link-to}}

// this one will set direction to whatever 'otherDirection' property of controller is
{{#link-to 'posts' directionBinding=otherDirection}}go to posts{{/link-to}}
```

Note that `context`  is used rather than model - this is because it is not necessairly the model (although it is in the default case)

### Gotchas

* query params are sticky - when they are set on a route, they will remain set unless you explicitly unset them e.g if you transition into `/posts/1?sort=name` and then the template has a `{{link-to 'posts' direction=desc}} ...` then the resulting route will be `/posts/1?sort=name&direction=desc`
    * most of the time this is what you want
* to clear a query param pass in a falsy value
  `{{#link-to 'posts', sort=false}}`
* boolean query params do not have a value in the query string
  `{queryParams: { isOk: true }}` becomes `/blah?isOk
* currently the 3 model hooks are all called again then the query params are changed but plans to fix this

# Obeservers gotcha

Their contents should be wrapped in `Ember.run.once`

```javascript
fooWatcher: function () {

  // Without the run loop,
  // Observers are synchronous so they might be called multiple times in a single run loop
  // which means they might be called with unexpected values
  Ember.run.once(this, function () {

  });
}.observes('thing'),
```
