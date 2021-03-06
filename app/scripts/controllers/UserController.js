define( function( require ) {
	'use strict';

	var _ = require( 'underscore' );
	var $ = require( 'jquery' );
	var Backbone = require( 'backbone' );
	var Marionette = require( 'marionette' );

	// require models
	var models = {
		User: require( 'models/UserModel' )
	};

	// require collections
	var collections = {
		Users: require( 'collections/UsersCollection' )
	};

	// require layouts
	var layouts = {
		User: require( 'views/layout/UserLayout' )
	};

	// require views
	var views = {
		UserMenuView: require( 'views/item/UserMenuView' ),
		UserSkillView: require( 'views/item/UserSkillView' ),
		UserContentsView: require( 'views/composite/UserContentsView' ),
		UserColleaguesView: require( 'views/item/UserColleaguesView' )
	};

	var globalVars = {
		_id: '52aaba1a4a451895ea2b6da1',
		_users: null
	};
	return Marionette.Controller.extend( {
		initialize: function( options ) {
			var self = this;

			_.bindAll( this );

			_.each( options, function( value, key ) {
				self[ key ] = value;
			} );

			this.showDefault();

			return this;
		},

		showDefault: function() {
			this.layout = this._getLayout();
			this.App.content.show( this.layout );
		},

		showProfile: function( id ) {
			var User = new models.User( {
				selectedMenu: 'Profile',
				_id: id
			} );

			User.fetch( {
				success: function( model, response, options ) {
					console.log( response );
				}
			} );
		},

		showSkills: function() {
			this._setActiveMenu();

			var User = new models.User( {
				selectedMenu: 'Skills'
			} );

			var view = new views.UserContentsView( {
				model: User,
				collection: new collections.Users(),
				itemView: views.UserSkillView
			} );

			this.layout.contentRegion.show( view );
		},

		showColleagues: function() {
			this._setActiveMenu();

			//Sample id. This should be taken from the currently logged in user.
			//var users = this._getUsers();

			var User = new models.User( {
				selectedMenu: 'Colleagues'
			} );

			var self = this;
			var users = [];
			User.fetch( {
				'success': function( model, response, options ) {
					for ( var key in response ) {
						users.push( response[ key ] );
					}

					users = _.without( users, _.findWhere( users, {
						'_id': globalVars._id
					} ) );

					_.each( users, function( u ) {
						//console.log( u );
						if ( u && u.registrationDate ) {
							u.registrationDate = new Date( Date.parse( u.registrationDate ) );
						}
					} );

					var view = new views.UserContentsView( {
						model: User,
						collection: new collections.Users( users ),
						itemView: views.UserColleaguesView
					} );

					self.layout.contentRegion.show( view );
				},
				'error': function() {
					return null;
				}
			} );


		},

		_getLayout: function() {
			var userLayout = new layouts.User();
			this.listenTo( userLayout, 'render', function() {
				this._showMenuAndContent( userLayout );
			}, this );

			return userLayout;
		},

		_showMenuAndContent: function() {
			this._addMenu( this.layout.menuRegion );

			//this.showUsers( this.layout.contentRegion, 'Users' );
		},

		_addMenu: function() {
			var User = new models.User( {
				colleaguesCtr: 3,
				skillsCtr: 3
			} );

			this.menu = new views.UserMenuView( {
				model: User
			} );

			this.layout.menuRegion.show( this.menu );
		},

		_setActiveMenu: function() {
			var currentRoute = '#' + Backbone.history.fragment;
			var menuOptions = this.menu.ui.menuOptions;
			var hashes = [];

			menuOptions.parent().siblings().removeClass( 'active' );

			_.each( menuOptions, function( value, key ) {
				hashes.push( value.hash );

				if ( currentRoute === value.hash ) {
					$( menuOptions[ key ] ).parent().addClass( 'active' );
				}
			} );

			// Set default active menu if current route has no match in the options hashes
			if ( $.inArray( currentRoute, hashes ) === -1 ) {
				$( menuOptions[ 0 ] ).parent().addClass( 'active' );
			}
		}
	} );
} );