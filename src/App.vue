<template>
  <v-app>
    <v-navigation-drawer v-if="isAuthenticated && $route.meta.requiresAuth" class="rounded-e-xl" color="primary"
      expand-on-hover floating permanent rail>
      <v-list class="" density="comfortable" nav>
        <v-list-item v-for="route in routes" :key="route.title" :to="route.path" :prepend-icon="route.icon"
          :title="route.title" link exact></v-list-item>

        <v-list-item @click="onLogout" prepend-icon="mdi-export" title="Выход" link exact>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item :prepend-icon="theme.global.name.value === 'westeros' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          @click="changeTheme" title="Переключить тему">
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar v-if="!$route.meta.requiresAuth" app>
      <v-toolbar color="primary">
        <v-spacer></v-spacer>
        <v-btn-group v-if="!isAuthenticated" class="mx-5" divided>
          <v-btn v-for="route in auth_routes" :key="route" :to="route.path" :prepend-icon="route.icon" color="indigo-darken-2" link exact>
            {{ route.title }}
          </v-btn>
        </v-btn-group>
        <v-btn-group v-else class="mx-5">
          <v-btn to="/account/mechanisms" :prepend-icon="'mdi-home'" variant="flat" color="indigo-darken-2" link exact>
            Кабинет пользователя
          </v-btn>
        </v-btn-group>

      </v-toolbar>

    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

import { useTheme } from 'vuetify'

export default {
  name: "ControlApp",
  setup() {
    const theme = useTheme()

    return {
      theme,
    }
  },
  data: () => ({
    isAuthenticated: null,
    themeSettings: {
      themeName: "westeros"
    },
    auth_routes: [
      {
        path: "/auth/login",
        title: "Войти",
        icon: "mdi-login",
      },
      {
        path: "/auth/register",
        title: "Регистрация",
        icon: "mdi-account-plus-outline",
      }
    ],
    routes: [
      {
        path: "/account/mechanisms",
        title: "Механизмы",
        icon: "mdi-hexagon-multiple",
      },
      {
        path: "/account/new_trajectory", 
        title: "Новая траектория",
        icon: "mdi-map-marker-path", 
      }, 
      {
        path: "/account/custom_params",
        title: "Доп. наблюдения",
        icon: "mdi-eye-plus",
      },
      {
        path: "/account/params",
        title: "Менеджер параметров",
        icon: "mdi-text-box-multiple-outline",
      },
      {
        path: "/account/components",
        title: "Компонентная база",
        icon: "mdi-folder",
      },
      {
        path: "/account/history",
        title: "История наблюдений",
        icon: "mdi-television-play",
      },
      {
        path: "/account/users",
        title: "Пользователи",
        icon: "mdi-account-group",
      }
    ],
  }),

  mounted() {
    this.isAuthenticated = localStorage.getItem("token") !== null ? true : false;

    this.themeSettings = this.$store.getters["GET_THEME_SETTINGS"];
    this.theme.global.name.value = this.themeSettings.themeName;

    this.$store.dispatch('ParamsModule/onSocketMsg');
  },

  methods: {
    changeTheme() {
      if (this.theme.global.name.value == 'westeros') {
        this.themeSettings.themeName = 'dark_vintage';
        this.theme.global.name.value = 'dark_vintage';
      } else {
        this.themeSettings.themeName = 'westeros';
        this.theme.global.name.value = 'westeros';
      }

      this.$store.dispatch("onChangeThemeSettings", this.themeSettings);
    },
    onLogout() {
      this.$store.dispatch("AuthModule/onLogout");
      this.$router.go({ path: '/auth/login' });
    }
  }
};
</script>

<style>
*::-webkit-scrollbar {
  width: 10px;
}

*::-webkit-scrollbar-track {
  background: rgb(179, 177, 177);
  border-radius: 10px;
}

*::-webkit-scrollbar-thumb {
  background: rgb(136, 136, 136);
  border-radius: 10px;
}

*::-webkit-scrollbar-thumb:hover {
  background: rgb(100, 100, 100);
  border-radius: 10px;
}

*::-webkit-scrollbar-thumb:active {
  background: rgb(68, 68, 68);
  border-radius: 10px;
}
</style>
