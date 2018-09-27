/*
    This file is part of the WordPress plugin Checkout with Vipps for WooCommerce
    Copyright (C) 2018 WP Hosting AS

    Checkout with Vipps for WooCommerce is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Checkout with Vipps for WooCommerce is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

jQuery( document ).ready( function() {
 // This fires when a product has been added to the cart with ajax. 
 jQuery( 'body' ).on( 'added_to_cart', function() {
  // nothing 
 });
 jQuery('body').on('check_variations', function () {
    console.log("variations check");
 });
 jQuery('body').on('found_variation', function (e,variation) {
   var purchasable=true;
   if ( ! variation.is_purchasable || ! variation.is_in_stock || ! variation.variation_is_visible ) {
     purchasable = false;
   }
   console.log("Found variation purchasable ->" + purchasable + "<-");
   if (purchasable) {
    jQuery('#do-express-checkout').removeAttr('disabled');
    jQuery('#do-express-checkout').removeClass('disabled');
   } else {
    jQuery('#do-express-checkout').attr('disabled','disabled');
    jQuery('#do-express-checkout').addClass('disabled');
   }
 });
 jQuery('body').on('reset_data', function () {
    console.log("reset data");
    jQuery('#do-express-checkout').attr('disabled','disabled');
    jQuery('#do-express-checkout').addClass('disabled');
 });
 jQuery('body').on('woocommerce_variation_has_changed',function () {
    console.log("Variation has changed");
 });
});
