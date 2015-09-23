/**
 * jQuery Filterbox
 * 
 * Reusable jQuery plugin for a "filter box" or an input with a dynamic label.
 * 
 * NOTE: this predates the wide acceptance of the "placeholder" attribute for input boxes, specifically < IE10. 
 * Plus it allows you to bind a clear button. 
 *
 * Options
 * 
 * overlayText - text that will show up in the overlay
 * clear - div containing the thing you want to act as a clear button
 * clearCallback - function that fires when you click the clear button
 * changeCallback - function that fires when the text changes in the input box (optional)
 */
(function($){

    $.widget('soschat.filterBox',  {
        _create: function(){ 
            
            this.$input = $(this.element).addClass('filterBox-input');
            if($.client.os == "Mac") {
                this.$input.css({
                    'padding-bottom':'0'
                });
            }
            //actual input box
            if(this.$input.parent().css('position') == "static") {
                this.$input.parent().css({
                    'position':'relative'
                });
            }
            //text and background overlay
            var filterText = this.options.overlayText ? this.options.overlayText : "Filter...";
            this.$overlay = $('<div class="filter-overlay">'+filterText+'</div>').insertAfter(this.element);
            this.$overlay.css({
                'width':this.$input.outerWidth()-12,
                'height':this.$input.outerHeight()-9 <= 0 ? 11 : this.$input.outerHeight()-9
            });
            //clear "x"
            this.$clear = this.options.clear.insertAfter(this.element);
            this.$clear.hide();
        },
        /**
         * Determines whether or not to show the label
         * @param String val - Current value of the input box
         */
        _checkval: function(val) {
        	var self = this;
            if(val != "") {
                self.$clear.show();
                self.$overlay.hide();
            } else {
                self.$clear.hide();
                self.$overlay.show();
            }
        	
        },
        _init: function() {
            var self = this, options = this.options;
            self.$overlay.on('click', function(e){
                $(this).hide();
                self.$input.focus();
            });
            
            var keyupTimeout;
            self.$input.on('keyup', function() {  
                var val = self.$input.val();
                self._checkval(val);
                if(typeof options.changeCallback == 'function') {
                    clearTimeout(keyupTimeout);
                    keyupTimeout = setTimeout(function() {
                        options.changeCallback(val);
                    },400);                    
                }
            })
            .on('keydown', function() {  
                var val = self.$input.val();
                self._checkval(val);
            })            
            .on('focus', function(e){
                var val = self.$input.val();
                self._checkval(val);
            })
            .on('blur', function(e){
                if( $(this).val() == "") {
                    self.$overlay.show();
                    self.$clear.hide();
                }
            });
            
            self.$clear.on('click', function(e){
                self.$clear.hide();
                self.$overlay.show();
                self.$input.val('').trigger('change').trigger('keyup');
                options.clearCallback ? options.clearCallback('') : function(){};   
            });
            self._checkval(self.$input.val());
        },
        _render: function() {      
            this.element.show();
        },
        setValue: function(val) {
        	this.$input.val(val);
        	this._checkval(val);
        },        
        clear: function(){
            var self = this;
            self.$clear.trigger('click');
        }
   
    });

})(jQuery);

