from .constants import *

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
    'create_coupon' : 'Coupon created successfully',

    #update
    'update_profile' : 'Profile updated successfully',
    'update_location' : 'Address updated successfully',
    'update_game' : 'Game updated successfully',
    'update_image' : 'Image updated successfully',
    'update_court' : 'Court updated successfully',
    'update_slot': 'Slot updated successfully',
    'update_workingdays': 'Working days updated successfully',
    'update_amenities': 'Amenities updated successfully',
    'update_rules': 'Rules updated successfully',
    'update_happy': 'Happy hours updated successfully',

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

    #tenant
    'org_approve' : 'Organization is Approved !!!',
    'orglocation_approve' : 'Organization location is Approved !!!',
    'org_cancel' : 'Organization is Cancelled',
    'orglocation_cancel' : 'Organization location is Cancelled',
}

ERROR_MESSAGES = {
    'alt_number_invalid': 'Alternate number must be exactly 10 digits',
    'default_slot_failure':'Without opening/closing time slots can not be created',
    'form_validation_failed_profile' : 'Profile update failed',
    'form_validation_failed_location': 'Location update failed ',
    'form_validation_failed_game': 'Game update failed ',
    'form_validation_failed_image': 'Image update failed ',
    'form_validation_failed_court': 'Court update failed ',
    'form_validation_failed_slot': 'Slot update failed ',
    'form_validation_failed_slot_1': 'A slot with the same details already exists',
    'form_validation_failed_slot_2': 'Time difference between slots must exactly be one hour ',
    'form_validation_failed_working_days': 'Working days update failed ',
    'form_validation_failed_amenities': 'Amenities update failed ',
    'form_validation_failed_generic': 'Please correct the error below ',
    'form_validation_failed_user_exist_without_group': 'User exist without group ',
    'happy_failure': 'Happy hours update failed !!!',
    'location_duplicate' : 'Location update failed, This Pincode,Phone Number and Area combination already exists',
    'no_organization' : 'Organization not found',
    'no_organization_location' : 'Organization Location not found',
    'no_pk' : 'PK not found in session',
    'no_games' : 'No games found for this location',
    'no_courts' : 'No courts found for this location',
    'no_images' : 'No images found for this location',
    'no_working_days' : 'No working days found for this location',
    'no_amenities' : 'No amenities found for this location',
    'no_slots' : 'No slots found for this location',
    'no_slot_id' : 'No slot id found',
    'past_date' : 'Date can not be in the past',
    'phone_number_invalid': 'Phone number must be exactly 10 digits',
    'working_days_is_active_failure': 'At least one day must be active',
    'working_days_time_failure': 'Active days must have both start and end times',
    'working_days_start_time_failure': 'Opening time and closing time cannot be same',
    'working_days_failure': 'Closing time cannot be before opening time',
}

MAIL_MESSAGES = {
    'welcome': f'Welcome to {brand}'
}

