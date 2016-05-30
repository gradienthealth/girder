import AssetstoreModel from 'girder/models/AssetstoreModel';
import { events } from 'girder/events';
import router from 'girder/router';
import View from 'girder/view';

import S3ImportTemplate from 'girder/templates/body/s3Import.jade';

var S3ImportView = View.extend({
    events: {
        'submit .g-s3-import-form': function (e) {
            e.preventDefault();

            var destId = this.$('#g-s3-import-dest-id').val().trim(),
                destType = this.$('#g-s3-import-dest-type').val();

            this.$('.g-validation-failed-message').empty();

            this.assetstore.off('g:imported').on('g:imported', function () {
                router.navigate(destType + '/' + destId, {trigger: true});
            }, this).on('g:error', function (resp) {
                this.$('.g-validation-failed-message').text(resp.responseJSON.message);
            }, this).import({
                importPath: this.$('#g-s3-import-path').val().trim(),
                destinationId: destId,
                destinationType: destType,
                progress: true
            });
        }
    },

    initialize: function (settings) {
        this.assetstore = settings.assetstore;
        this.render();
    },

    render: function () {
        this.$el.html(S3ImportTemplate({
            assetstore: this.assetstore
        }));
    }
});

// This route is only preserved for backward compatibility. The generic route
// "assetstore/:id/import" is preferred, and is defined in AssetstoresView.js.
router.route('assetstore/:id/s3import', 's3Import', function (assetstoreId) {
    var assetstore = new AssetstoreModel({
        _id: assetstoreId
    });

    assetstore.once('g:fetched', function () {
        events.trigger('g:navigateTo', S3ImportView, {
            assetstore: assetstore
        });
    }).fetch();
});

export default S3ImportView;
