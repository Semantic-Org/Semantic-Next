import { $ } from '@semantic-ui/query';

// Configure the form schema
$('#registration-form').settings({
  schema: [
    {
      type: 'text',
      name: 'username',
      label: 'Username',
      required: true,
      placeholder: 'Enter your username',
      validation: (value) => !value ? 'Username is required' : null
    },
    {
      type: 'text',
      name: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'you@example.com',
      validation: (value) => {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return null;
      }
    },
    {
      type: 'select',
      name: 'role',
      label: 'Role',
      placeholder: 'Select a role',
      options: [
        { value: 'user', label: 'Regular User' },
        { value: 'admin', label: 'Administrator' },
        { value: 'editor', label: 'Content Editor' }
      ],
      validation: (value) => !value ? 'Please select a role' : null
    },
    {
      type: 'textarea',
      name: 'bio',
      label: 'Bio',
      placeholder: 'Tell us about yourself...',
      helpText: 'Tell us about yourself (optional)'
    }
  ],
  submitLabel: 'Create Account',
  onSubmit: async (values) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form submitted with values:', values);
    return values;
  }
});

// Listen for form events
$('#registration-form').on('submit-success', (event) => {
  $('#form-data').text(JSON.stringify(event.detail.values, null, 2));
});

$('#registration-form').on('validation-failed', (event) => {
  console.log('Validation failed:', event.detail.errors);
});
