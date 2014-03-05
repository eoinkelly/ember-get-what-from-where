window.App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  ready: function() {
    // this = window.App (the ember application object)
    // arguments = []
  },

  // calls Ember.Application.initialize() // initializes (boots) the app


  // Ember.application.deferReadiness() // call to prevent app initalizing. how?
  // Ember.Application.advanceReadiness() // call when I am ready for app to initialize

  customEvents: function() {

  },

  // rootElement: '#app, // DOM element or jQuery selector string

  // TODO: other hooks in here?
  //
  // we are calling create here on an object - do the normal create() rules apply?
  // e.g. only override static properties
});

// Router

App.Router.map( function() {
  this.route( 'simple' );
  this.resource( 'posts', function() {
    this.route( 'post' );
  });
});

App.ApplicationRoute = Ember.Route.extend({ 

  actions: {
    someAction: function() {
    }
  }

});

App.IntroRoute = Ember.Route.extend({
  
  model: function( params ) {
    return this.store.find( 'page' )
  }
  
})

App.IntroIndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo( 'intro.page', 0 )
  }
})

App.IntroPageRoute = Ember.Route.extend({
  
  page: 0,
  
  model: function( params ) {
    // Figure out the page number
    this.set( 'page', parseInt( params.number, 10 ) )
    // Grab model from parent model (collection)
    return this.modelFor( 'intro' )
      .objectAt( this.get( 'page' ) )
  },
  
  afterModel: function() {
    
    var currentPage = this.get( 'page' )
    var pageCount = this.pageCount()
    
    currentPage === ( pageCount - 1 ) ?
      this.controllerFor( 'intro' ).set( 'isLastPage', true ) :
      this.controllerFor( 'intro' ).set( 'isLastPage', false )
    
    currentPage === 0 ?
      this.controllerFor( 'intro' ).set( 'isFirstPage', true ) :
      this.controllerFor( 'intro' ).set( 'isFirstPage', false )
    
  },
  
  actions: {
    
    previous: function() {
      
      var currentPage = this.get( 'page' )
      var pageCount = this.pageCount()
      
      var nextPage = Math.max( 0, currentPage - 1 )
      
      this.transitionTo( 'intro.page', nextPage )
      
    },
    
    next: function() {
      
      var currentPage = this.get( 'page' )
      var pageCount = this.pageCount()
      
      var nextPage = Math.min(
        currentPage + 1, pageCount - 1
      )
      
      this.transitionTo( 'intro.page', nextPage )
      
    }
    
  },
  
  pageCount: function() {
    return this.modelFor( 'intro' ).get( 'length' )
  },
  
  renderTemplate: function( controller, model ) {
    var template = App.layouts[ model.get( 'layout' ) ]
    this.render( template )
  }
  
});

App.DemoRoute = Ember.Route.extend({
  
  model: function() {
    return this.store.find( 'page', 1 )
  },
  
  renderTemplate: function() {
    var key = this.currentModel.get('layout')
    this.render( App.layouts[key] )
  }
  
});

App.SimpleRoute = Ember.Route.extend({
  
  model: function() {
    return this.store.find( 'page', 1 )
  },
  
  // renderTemplate: function() {
    // args?
  // }
  
});

App.SimpleController = Ember.ObjectController.extend({

  simpleStaticProperty: 12,

  simpleComputedProperty: (function() {

    // From within a controller computed property ...

    // what is 'this'?
    // ===============
    // this = the controller

    // what are args?
    // =============
    // arguments = ['simpleComputedProperty']
    // * it seems to be an array with just the property name in it ???

    // how do I get at my model
    // ========================
    // this.get('model') // works
    // * this.model does not work because ???
    //    ? model is a computed property of the controller object
    // * if I am extended from Ember.Controller I can still get at my model 
    //   but the template will not be able to access model properties

    // How do I get an attribute of my model?
    // ======================================
    // this.get('model').get('someAttr')

    // how do i get at my route object?
    // ============================
    // ???


    // how do i get a reference to the application-wide router?
    // ========================================================
    // this.get('target') 
    // * gets the object to which actions from the view should be 
    //   sent (by default this is the router)

    // How can I trigger an action as if it came from my template?
    // ========================================================
    // * send an action to the **router** which will delegate it to the currently 
    //   active route heirarchy as per the usual action bubbling rules
    // * this mimics what would happen if a template triggered an action
    // this.get('target').send('action-name')

    // how do I get a ref to a different controller?
    // ============================================

    // option 1:
    // ---------
    // this.controllerFor('other-route-name') // works but is depreacted in favour of this.needs

    // option 2:
    // ---------
    // * you can specify the controllers you want to access in the `needs` array
    // * any controllers you add to needs will be accessible through the 'controllers' property
    // this.needs = ['post'] // an array of route names (ember can work out the corresponding controller names)
    postTitle: (function() {
      var currentPost = this.get('controllers.post');
      // TODO: it seems the arg to get() can be more than just a simple identifier ???
      return currentPost.get('title');
    }).property('controllers.post.title')
    // TODO: figure this out


    // how do I get a ref to another controller's model?
    // =================================================
    // ???

    // how do I get a ref to another route in the system?
    // ==================================================
    // ???

    actions: {

      // How do invoke an action from another action?
      // ============================================
      // TODO: waht is the context ???
      doThing: function() {
      },
      doOtherThing: function() {
        this.send('doThing', 'some.context');
      }

    }

    return "hello";
  }).property()

});


// How do I set computed properties on an object when I create it?
// ============

// Ember .extend creates a factory
App.SomeObject = Ember.Object.extend({

  simpleProp: 'hello',

  computedProp: (function() {
    return "complex";
  }).property(),

  simpleFunc: function(a, b) {
    // this = the current instance of App.SomeObject 
    // arguments = whatever you passed in manually

    this.simpleProp;          // works
    this.get('simpleProp');   // works
    this.get('complexProp');  // works
    this.computedProp;        // does not work

    // QUESTION: why does this.computedProp exist if we are not to use it?
  }

});

window.thing = App.SomeObject.create({
  // NB: only set simple properties in the hash you pass to create!
  //    * if you try to pass a computed property it will get overwritten by the prop you pass in
  simpleProp: 'eoin',
  // computedProp: 'other' // this will overwrite the computedProp from the class defn!
});

thing.get('simpleProp');    // works
thing.simpleProp;           // works
thing.get('computedProp');  // works
thing.computedProp;         // returns undefined - does NOT work 
thing.simpleFunc(23,44);    // works
debugger
