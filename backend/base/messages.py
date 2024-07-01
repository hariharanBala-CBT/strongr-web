# constant toast messages for success and error.

SUCCESS_MESSAGES = {
    #create
    'create_slot' : 'Slot created successfully',
    'create_court' : 'Court created successfully',
    'create_game' : 'Game created successfully',
    'create_image' : 'Image created successfully',
    'create_tempslot' : 'Temporary slots created successfully',
    'create_multipleslot' : 'Multiple slots created successfully',
    'create_additional_slot' : 'Created Additional slot successfully',
    'create_unavailable_slot' : 'Created Unavailable slot successfully',
    'create_location' : 'Location created successfully',

    #update
    'update_profile' : 'Profile updated successfully',
    'update_location' : 'Address updated successfully',
    'update_game' : 'Game updated successfully',
    'update_image' : 'Image updated successfully',
    'update_court' : 'Court updated successfully',
    'update_slot': 'Slot updated successfully',
    'update_workingdays': 'Working days updated successfully',
    'update_amenities': 'Amenities updated successfully',

    #delete
    'delete_image': 'Image deleted successfully',
    'delete_court': 'Court deleted successfully',
    'delete_slot': 'Slot deleted successfully',
    'delete_additional_slot' : 'Deleted Additional slot successfully',
    'delete_unavailable_slot' : 'Deleted Unavailable slot successfully',

    #org
    'preview' : 'Preview submitted successfully',
    'org_status' : 'Organization status updated successfully',
    'orglocation_status' : 'Organization location status updated successfully',

    'change_password' : 'Your password was successfully updated',
}

ERROR_MESSAGES = {
    'form_validation_failed_profile': 'Profile update failed',
    'form_validation_failed_location': 'Location update failed ',
    'form_validation_failed_game': 'Game update failed ',
    'form_validation_failed_image': 'Image update failed ',
    'form_validation_failed_court': 'Court update failed ',
    'form_validation_failed_slot': 'Slot update failed ',
    'form_validation_failed_working_days': 'Working days update failed ',
    'form_validation_failed_amenities': 'Amenities update failed ',
    'form_validation_failed_generic': 'Please correct the error below ',
    'form_validation_failed_user_exist_without_group': 'User exist without group ',
    'phone_number_invalid': 'Phone number must be exactly 10 digits.',
    'alt_number_invalid': 'Alternate number must be exactly 10 digits.',
    'working_days_is_active_failure': 'At least one day must be active.',
    'working_days_time_failure': 'Active days must have both start and end times.',
}
