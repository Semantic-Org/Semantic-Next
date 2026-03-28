# UI Component Skeletons

## 1. Todo App

```html
<ui-container>
  <ui-heading>My Todos</ui-heading>
  <ui-flex>
    <ui-input placeholder="Add a task..."></ui-input>
    <ui-button>Add</ui-button>
  </ui-flex>
  <ui-list>
    <ui-checkbox>Buy groceries</ui-checkbox>
    <ui-checkbox>Walk the dog</ui-checkbox>
    <ui-checkbox checked>Reply to emails</ui-checkbox>
  </ui-list>
</ui-container>
```

## 2. SaaS Landing Page

```html
<ui-navbar>
  <ui-image slot="logo" src="logo.svg"></ui-image>
  <ui-navigation-menu>
    <ui-link>Features</ui-link>
    <ui-link>Pricing</ui-link>
    <ui-link>Docs</ui-link>
  </ui-navigation-menu>
  <ui-button>Get Started</ui-button>
</ui-navbar>

<ui-container>
  <ui-heading>Ship faster with Acme</ui-heading>
  <ui-text>The all-in-one platform for modern teams.</ui-text>
  <ui-flex>
    <ui-button>Start Free Trial</ui-button>
    <ui-button>Learn More</ui-button>
  </ui-flex>

  <ui-grid columns="3">
    <ui-card>
      <ui-icon name="bolt"></ui-icon>
      <ui-heading>Fast</ui-heading>
      <ui-text>Built for speed from the ground up.</ui-text>
    </ui-card>
    <ui-card>
      <ui-icon name="shield"></ui-icon>
      <ui-heading>Secure</ui-heading>
      <ui-text>Enterprise-grade security by default.</ui-text>
    </ui-card>
    <ui-card>
      <ui-icon name="chart-bar"></ui-icon>
      <ui-heading>Scalable</ui-heading>
      <ui-text>Grows with your team.</ui-text>
    </ui-card>
  </ui-grid>

  <ui-divider></ui-divider>

  <ui-heading>Pricing</ui-heading>
  <ui-grid columns="3">
    <ui-card>
      <ui-heading>Free</ui-heading>
      <ui-statistic value="$0" label="/month"></ui-statistic>
      <ui-list>
        <li>5 projects</li>
        <li>1 GB storage</li>
      </ui-list>
      <ui-button>Sign Up</ui-button>
    </ui-card>
    <ui-card>
      <ui-heading>Pro</ui-heading>
      <ui-statistic value="$29" label="/month"></ui-statistic>
      <ui-list>
        <li>Unlimited projects</li>
        <li>100 GB storage</li>
      </ui-list>
      <ui-button>Subscribe</ui-button>
    </ui-card>
    <ui-card>
      <ui-heading>Enterprise</ui-heading>
      <ui-statistic value="Custom" label="pricing"></ui-statistic>
      <ui-list>
        <li>Dedicated support</li>
        <li>SLA guarantee</li>
      </ui-list>
      <ui-button>Contact Sales</ui-button>
    </ui-card>
  </ui-grid>
</ui-container>
```

## 3. User Settings Page

```html
<ui-container>
  <ui-heading>Settings</ui-heading>

  <ui-tabs>
    <ui-tab title="Profile">
      <ui-form>
        <ui-flex>
          <ui-avatar size="large" src="avatar.jpg"></ui-avatar>
          <ui-file-upload>Change Photo</ui-file-upload>
        </ui-flex>
        <ui-form-field label="Name">
          <ui-input value="Jane Doe"></ui-input>
        </ui-form-field>
        <ui-form-field label="Email">
          <ui-input value="jane@example.com"></ui-input>
        </ui-form-field>
        <ui-form-field label="Bio">
          <ui-textarea></ui-textarea>
        </ui-form-field>
        <ui-button>Save</ui-button>
      </ui-form>
    </ui-tab>

    <ui-tab title="Notifications">
      <ui-form>
        <ui-switch>Email notifications</ui-switch>
        <ui-switch>Push notifications</ui-switch>
        <ui-switch>Weekly digest</ui-switch>
        <ui-button>Save</ui-button>
      </ui-form>
    </ui-tab>

    <ui-tab title="Security">
      <ui-form>
        <ui-form-field label="Current Password">
          <ui-password-input></ui-password-input>
        </ui-form-field>
        <ui-form-field label="New Password">
          <ui-password-input></ui-password-input>
        </ui-form-field>
        <ui-button>Update Password</ui-button>
      </ui-form>
    </ui-tab>
  </ui-tabs>
</ui-container>
```

## 4. Sales Metrics Dashboard

```html
<ui-container>
  <ui-heading>Sales Dashboard</ui-heading>

  <ui-grid columns="4">
    <ui-card>
      <ui-statistic value="$48,200" label="Revenue"></ui-statistic>
    </ui-card>
    <ui-card>
      <ui-statistic value="342" label="Orders"></ui-statistic>
    </ui-card>
    <ui-card>
      <ui-statistic value="1,205" label="Customers"></ui-statistic>
    </ui-card>
    <ui-card>
      <ui-statistic value="$140.94" label="Avg Order"></ui-statistic>
    </ui-card>
  </ui-grid>

  <ui-grid columns="2">
    <ui-card>
      <ui-heading>Revenue Over Time</ui-heading>
      <ui-chart type="line"></ui-chart>
    </ui-card>
    <ui-card>
      <ui-heading>Sales by Category</ui-heading>
      <ui-chart type="bar"></ui-chart>
    </ui-card>
  </ui-grid>

  <ui-card>
    <ui-heading>Recent Orders</ui-heading>
    <ui-table>
      <ui-table-row>
        <ui-table-cell>Order #1042</ui-table-cell>
        <ui-table-cell>Jane Smith</ui-table-cell>
        <ui-table-cell>$250.00</ui-table-cell>
        <ui-table-cell><ui-label>Completed</ui-label></ui-table-cell>
      </ui-table-row>
      <ui-table-row>
        <ui-table-cell>Order #1041</ui-table-cell>
        <ui-table-cell>Bob Lee</ui-table-cell>
        <ui-table-cell>$89.99</ui-table-cell>
        <ui-table-cell><ui-label>Pending</ui-label></ui-table-cell>
      </ui-table-row>
    </ui-table>
    <ui-pagination></ui-pagination>
  </ui-card>
</ui-container>
```

## 5. Login Page

```html
<ui-container>
  <ui-card>
    <ui-image src="logo.svg"></ui-image>
    <ui-heading>Sign In</ui-heading>
    <ui-form>
      <ui-form-field label="Email">
        <ui-input type="email" placeholder="you@example.com"></ui-input>
      </ui-form-field>
      <ui-form-field label="Password">
        <ui-password-input></ui-password-input>
      </ui-form-field>
      <ui-flex>
        <ui-checkbox>Remember me</ui-checkbox>
        <ui-link>Forgot password?</ui-link>
      </ui-flex>
      <ui-button>Sign In</ui-button>
    </ui-form>
    <ui-divider>or</ui-divider>
    <ui-button>Continue with Google</ui-button>
    <ui-text>Don't have an account? <ui-link>Sign up</ui-link></ui-text>
  </ui-card>
</ui-container>
```

## 6. Blog Post Page

```html
<ui-navbar>
  <ui-image slot="logo" src="logo.svg"></ui-image>
  <ui-navigation-menu>
    <ui-link>Home</ui-link>
    <ui-link>Blog</ui-link>
    <ui-link>About</ui-link>
  </ui-navigation-menu>
</ui-navbar>

<ui-container>
  <ui-breadcrumb>
    <ui-link>Home</ui-link>
    <ui-link>Blog</ui-link>
    <span>Post Title</span>
  </ui-breadcrumb>

  <ui-heading>How We Built Our Design System</ui-heading>
  <ui-flex>
    <ui-avatar src="author.jpg"></ui-avatar>
    <ui-text>Jane Doe</ui-text>
    <ui-text>March 27, 2026</ui-text>
  </ui-flex>
  <ui-image src="hero.jpg"></ui-image>

  <ui-typography>
    <p>Article content goes here...</p>
    <h2>Subheading</h2>
    <p>More content...</p>
    <ui-code language="javascript">const x = 1;</ui-code>
    <p>Conclusion paragraph...</p>
  </ui-typography>

  <ui-divider></ui-divider>

  <ui-heading>Related Posts</ui-heading>
  <ui-grid columns="3">
    <ui-card>
      <ui-image src="related-1.jpg"></ui-image>
      <ui-heading>Related Post 1</ui-heading>
      <ui-text>Short excerpt...</ui-text>
    </ui-card>
    <ui-card>
      <ui-image src="related-2.jpg"></ui-image>
      <ui-heading>Related Post 2</ui-heading>
      <ui-text>Short excerpt...</ui-text>
    </ui-card>
    <ui-card>
      <ui-image src="related-3.jpg"></ui-image>
      <ui-heading>Related Post 3</ui-heading>
      <ui-text>Short excerpt...</ui-text>
    </ui-card>
  </ui-grid>
</ui-container>
```

## 7. Contacts Directory

```html
<ui-container>
  <ui-flex>
    <ui-heading>Contacts</ui-heading>
    <ui-button>Add Contact</ui-button>
  </ui-flex>

  <ui-flex>
    <ui-input icon="search" placeholder="Search contacts..."></ui-input>
    <ui-dropdown placeholder="Department">
      <option>Engineering</option>
      <option>Design</option>
      <option>Marketing</option>
    </ui-dropdown>
  </ui-flex>

  <ui-table>
    <ui-table-row>
      <ui-table-cell>
        <ui-flex>
          <ui-avatar src="avatar1.jpg"></ui-avatar>
          <ui-text>Alice Johnson</ui-text>
        </ui-flex>
      </ui-table-cell>
      <ui-table-cell>alice@example.com</ui-table-cell>
      <ui-table-cell>Engineering</ui-table-cell>
      <ui-table-cell><ui-label>Active</ui-label></ui-table-cell>
    </ui-table-row>
    <ui-table-row>
      <ui-table-cell>
        <ui-flex>
          <ui-avatar src="avatar2.jpg"></ui-avatar>
          <ui-text>Bob Smith</ui-text>
        </ui-flex>
      </ui-table-cell>
      <ui-table-cell>bob@example.com</ui-table-cell>
      <ui-table-cell>Design</ui-table-cell>
      <ui-table-cell><ui-label>Active</ui-label></ui-table-cell>
    </ui-table-row>
  </ui-table>

  <ui-pagination></ui-pagination>
</ui-container>
```

## 8. E-Commerce Product Page

```html
<ui-navbar>
  <ui-image slot="logo" src="logo.svg"></ui-image>
  <ui-navigation-menu>
    <ui-link>Shop</ui-link>
    <ui-link>Categories</ui-link>
    <ui-link>Deals</ui-link>
  </ui-navigation-menu>
  <ui-button icon="cart">Cart (2)</ui-button>
</ui-navbar>

<ui-container>
  <ui-breadcrumb>
    <ui-link>Home</ui-link>
    <ui-link>Electronics</ui-link>
    <span>Wireless Headphones</span>
  </ui-breadcrumb>

  <ui-grid columns="2">
    <ui-carousel>
      <ui-image src="product-1.jpg"></ui-image>
      <ui-image src="product-2.jpg"></ui-image>
      <ui-image src="product-3.jpg"></ui-image>
    </ui-carousel>

    <div>
      <ui-heading>Wireless Headphones Pro</ui-heading>
      <ui-rating value="4.5"></ui-rating>
      <ui-text>$199.99</ui-text>

      <ui-form>
        <ui-form-field label="Color">
          <ui-select>
            <option>Black</option>
            <option>White</option>
            <option>Navy</option>
          </ui-select>
        </ui-form-field>
        <ui-form-field label="Quantity">
          <ui-number-input min="1" max="10" value="1"></ui-number-input>
        </ui-form-field>
      </ui-form>

      <ui-flex>
        <ui-button>Add to Cart</ui-button>
        <ui-button>Buy Now</ui-button>
      </ui-flex>

      <ui-accordion>
        <ui-accordion-item title="Description">
          <ui-text>Premium wireless headphones with active noise cancellation...</ui-text>
        </ui-accordion-item>
        <ui-accordion-item title="Specifications">
          <ui-list>
            <li>Battery: 30 hours</li>
            <li>Bluetooth 5.2</li>
            <li>Weight: 250g</li>
          </ui-list>
        </ui-accordion-item>
        <ui-accordion-item title="Shipping">
          <ui-text>Free shipping on orders over $50.</ui-text>
        </ui-accordion-item>
      </ui-accordion>
    </div>
  </ui-grid>
</ui-container>
```

## 9. Support Ticket Form

```html
<ui-container>
  <ui-heading>Submit a Support Ticket</ui-heading>
  <ui-text>We'll get back to you within 24 hours.</ui-text>

  <ui-form>
    <ui-grid columns="2">
      <ui-form-field label="Name" required>
        <ui-input placeholder="Your name"></ui-input>
      </ui-form-field>
      <ui-form-field label="Email" required>
        <ui-input type="email" placeholder="you@example.com"></ui-input>
      </ui-form-field>
    </ui-grid>

    <ui-form-field label="Category" required>
      <ui-select placeholder="Select a category">
        <option>Bug Report</option>
        <option>Feature Request</option>
        <option>Billing</option>
        <option>General Inquiry</option>
      </ui-select>
    </ui-form-field>

    <ui-form-field label="Priority">
      <ui-radio-button>Low</ui-radio-button>
      <ui-radio-button>Medium</ui-radio-button>
      <ui-radio-button>High</ui-radio-button>
    </ui-form-field>

    <ui-form-field label="Subject" required>
      <ui-input placeholder="Brief summary of the issue"></ui-input>
    </ui-form-field>

    <ui-form-field label="Description" required>
      <ui-textarea placeholder="Describe your issue in detail..."></ui-textarea>
    </ui-form-field>

    <ui-form-field label="Attachments">
      <ui-file-upload multiple></ui-file-upload>
    </ui-form-field>

    <ui-button>Submit Ticket</ui-button>
  </ui-form>
</ui-container>
```

## 10. Photo Gallery

```html
<ui-container>
  <ui-flex>
    <ui-heading>Photo Gallery</ui-heading>
    <ui-button>Upload</ui-button>
  </ui-flex>

  <ui-tabs>
    <ui-tab title="All">
      <ui-grid columns="4">
        <ui-card>
          <ui-aspect-ratio ratio="1">
            <ui-image src="photo-1.jpg"></ui-image>
          </ui-aspect-ratio>
          <ui-text>Sunset</ui-text>
        </ui-card>
        <ui-card>
          <ui-aspect-ratio ratio="1">
            <ui-image src="photo-2.jpg"></ui-image>
          </ui-aspect-ratio>
          <ui-text>Mountains</ui-text>
        </ui-card>
        <ui-card>
          <ui-aspect-ratio ratio="1">
            <ui-image src="photo-3.jpg"></ui-image>
          </ui-aspect-ratio>
          <ui-text>Ocean</ui-text>
        </ui-card>
        <ui-card>
          <ui-aspect-ratio ratio="1">
            <ui-image src="photo-4.jpg"></ui-image>
          </ui-aspect-ratio>
          <ui-text>Forest</ui-text>
        </ui-card>
      </ui-grid>
    </ui-tab>
    <ui-tab title="Favorites">
      <ui-grid columns="4">
        <ui-card>
          <ui-aspect-ratio ratio="1">
            <ui-image src="photo-1.jpg"></ui-image>
          </ui-aspect-ratio>
          <ui-text>Sunset</ui-text>
        </ui-card>
      </ui-grid>
    </ui-tab>
    <ui-tab title="Albums">
      <ui-grid columns="3">
        <ui-card>
          <ui-image src="album-cover-1.jpg"></ui-image>
          <ui-heading>Vacation 2026</ui-heading>
          <ui-text>24 photos</ui-text>
        </ui-card>
        <ui-card>
          <ui-image src="album-cover-2.jpg"></ui-image>
          <ui-heading>Portraits</ui-heading>
          <ui-text>12 photos</ui-text>
        </ui-card>
      </ui-grid>
    </ui-tab>
  </ui-tabs>

  <ui-pagination></ui-pagination>
</ui-container>
```
