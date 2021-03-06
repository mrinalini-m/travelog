<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <Alert />
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" :sm="cols.sm" :md="cols.md">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-btn text icon @click="handleClickBackButton">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-toolbar-title>Create Your Account</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form
              id="register-form"
              @submit.prevent="handleSubmit"
              ref="form"
              v-model="valid"
              lazy-validation
            >
              <v-text-field
                label="Email"
                name="email"
                v-model="email"
                :rules="emailRules"
                prepend-icon="mdi-account"
                type="text"
              />
              <v-text-field
                label="Username"
                name="username"
                v-model="username"
                :rules="usernameRules"
                prepend-icon="mdi-account"
                type="text"
              />
              <v-text-field
                id="password"
                label="Password"
                name="password"
                prepend-icon="mdi-lock"
                v-model="password"
                :rules="passwordRules"
                type="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn to="/login" text color="primary">
              Login instead
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="!valid"
              color="primary"
              class="mr-4"
              @click="validate"
              type="submit"
              form="register-form"
              >Register</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import Alert from '@/components/Alert'

  export default {
    data() {
      return {
        email: '',
        password: '',
        username: '',
        submitted: false,
        valid: true,
        passwordRules: [v => !!v || 'Password is required'],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        usernameRules: [
          v => !!v || 'Username is required',
          v =>
            /^[a-z0-9_-]{3,15}$/.test(v) ||
            'Username must be 3-15 characters long and only contain letters, numbers, dashes and hyphens.'
        ]
      }
    },
    props: {
      cols: {
        type: Object,
        required: false,
        default: () => ({ sm: 8, md: 4 })
      }
    },
    components: { Alert },
    computed: {
      ...mapState('account', ['status'])
    },
    created() {
      this.logout()
    },
    methods: {
      ...mapActions('account', ['register', 'logout']),
      validate() {
        if (this.$refs.form.validate()) {
          this.snackbar = true
        }
      },
      handleClickBackButton() {
        // router.push('/')
        this.$emit('backButtonClicked')
      },
      handleSubmit() {
        this.submitted = true
        const [email, password, username] = [
          this.email,
          this.password,
          this.username
        ]
        this.register({ email, password, username })
      }
    }
  }
</script>
