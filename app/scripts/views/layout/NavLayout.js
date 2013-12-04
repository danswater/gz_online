define( function ( require ) {
	'use strict';

	var Marionette    = require( 'backbone.marionette' );
	var _             = require( 'underscore' );
	var AdminNavView  = require( 'views/item/AdminNavView' );
	var User          = require( 'models/UserModel' );

	var templates = {
		'loggedIn'  : require( 'text!tmpl/layout/navLoggedIn.html' ),
		'loggedOut' : require( 'text!tmpl/layout/navLoggedOut.html' )
	};

	return Marionette.Layout.extend( {
		'templates' : {
			'loggedIn'  : _.template(templates.loggedIn),
			'loggedOut' : _.template(templates.loggedOut)
		},

		'regions' : {
			'navMenu'   : '#nav-menu'
		},

		className : 'container',

		'initialize' : function ( options ) {
			_.bindAll( this );

			var self = this;

			self.render()
		},

		'onRender' : function ( options ) {
			var UserModel = new User( {
				email : 'super.admin@globalzeal.net'
			} );

			this.navMenu.show( new AdminNavView( { model : UserModel } ) );

			return this;
		},

		'getTemplate' : function ( options ) {
			return this.templates.loggedIn;
		}

	} );
} );
