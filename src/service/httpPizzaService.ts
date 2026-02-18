import {
  PizzaService,
  Franchise,
  FranchiseList,
  Store,
  OrderHistory,
  User,
  Menu,
  Order,
  Endpoints,
  OrderResponse,
  JWTPayload,
} from "./pizzaService";

const pizzaServiceUrl = import.meta.env.VITE_PIZZA_SERVICE_URL;
const pizzaFactoryUrl = import.meta.env.VITE_PIZZA_FACTORY_URL;

class HttpPizzaService implements PizzaService {
  /**
   * The function that all service methods will call to send an HTTP Request to the backend to remove duplicate code
   * @param path /api/*something*
   * @param method default GET (could be PUT, POST, DELETE)
   * @param body optional, but will be put into json format
   * @returns The HTTP Response for that specific HTTP Request
   */
  async callEndpoint(
    path: string,
    method: string = "GET",
    body?: any,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const options: any = {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        };

        const authToken = localStorage.getItem("token");
        if (authToken) {
          options.headers["Authorization"] = `Bearer ${authToken}`;
        }

        if (body) {
          options.body = JSON.stringify(body);
        }

        if (!path.startsWith("http")) {
          path = pizzaServiceUrl + path;
        }

        const r = await fetch(path, options);
        const j = await r.json();
        if (r.ok) {
          resolve(j);
        } else {
          reject({ code: r.status, message: j.message });
        }
      } catch (e: any) {
        reject({ code: 500, message: e.message });
      }
    });
  }

  /**
   * Calls the POST /api/auth endpoint to login a new user
   * @param email
   * @param password
   * @returns User
   */
  async login(email: string, password: string): Promise<User> {
    const { user, token } = await this.callEndpoint("/api/auth", "PUT", {
      email,
      password,
    });
    localStorage.setItem("token", token);
    return Promise.resolve(user);
  }

  /**
   * Calls the POST /api/auth endpoint to register a new user
   * @param name
   * @param email
   * @param password
   * @returns User
   */
  async register(name: string, email: string, password: string): Promise<User> {
    const { user, token } = await this.callEndpoint("/api/auth", "POST", {
      name,
      email,
      password,
    });
    localStorage.setItem("token", token);
    return Promise.resolve(user);
  }

  /**
   * Calls the DELETE /api/auth endpoint to delete the authtoken of the authenticated user
   */
  logout(): void {
    this.callEndpoint("/api/auth", "DELETE");
    localStorage.removeItem("token");
  }

  /**
   * Calls the GET /api/user/me endpoint to get the authenticated user
   * @returns User or null
   */
  async getUser(): Promise<User | null> {
    let result: User | null = null;
    if (localStorage.getItem("token")) {
      try {
        result = await this.callEndpoint("/api/user/me");
      } catch (e) {
        localStorage.removeItem("token");
      }
    }
    return Promise.resolve(result);
  }

  /**
   * Calls the GET /api/order/menu to get the menu
   * @returns Menu
   */
  async getMenu(): Promise<Menu> {
    return this.callEndpoint("/api/order/menu");
  }

  /**
   * Calls the GET /api/order endpoint to get the orders for the authenticated user
   * @param user
   * @returns OrderHistory
   */
  async getOrders(user: User): Promise<OrderHistory> {
    return this.callEndpoint("/api/order");
  }

  /**
   * Calls the POST /api/order endpoint to create a new order for the authenticated user
   * @param order
   * @returns OrderResponse
   */
  async order(order: Order): Promise<OrderResponse> {
    return this.callEndpoint("/api/order", "POST", order);
  }

  /**
   * Calls the POST /api/order/verify endpoint to verify the JWT
   * @param jwt
   * @returns JWTPayload
   */
  async verifyOrder(jwt: string): Promise<JWTPayload> {
    return this.callEndpoint(pizzaFactoryUrl + "/api/order/verify", "POST", {
      jwt,
    });
  }

  /**
   * Calls the GET /api/franchise/franchiseID endpoint to get a specific franchise
   * @param user
   * @returns an array of Franchise
   */
  async getFranchise(user: User): Promise<Franchise[]> {
    return this.callEndpoint(`/api/franchise/${user.id}`);
  }

  /**
   * Calls the POST /api/franchise endpoint to create a new franchise
   * @param franchise
   * @returns the newly created Franchise
   */
  async createFranchise(franchise: Franchise): Promise<Franchise> {
    return this.callEndpoint("/api/franchise", "POST", franchise);
  }

  /**
   * Calls the GET /api/franchise endpoint to get `limit` amount of franchises
   * @param page where we start searching from, default 0
   * @param limit the amount of franchises you want at once, default 10
   * @param nameFilter Makes sure the Franchises follows a specific pattern. For example, if it's %the%, then all
   *   the franchises that have the word 'the' in it will return in a list
   * @returns FranchiseList
   */
  async getFranchises(
    page: number = 0,
    limit: number = 10,
    nameFilter: string = "*",
  ): Promise<FranchiseList> {
    return this.callEndpoint(
      `/api/franchise?page=${page}&limit=${limit}&name=${nameFilter}`,
    );
  }

  /**
   * Calls the DELETE /api/franchise/franchiseID endpoint to delete a specific franchise
   * @param franchise
   * @returns void
   */
  async closeFranchise(franchise: Franchise): Promise<void> {
    return this.callEndpoint(`/api/franchise/${franchise.id}`, "DELETE");
  }

  /**
   * Calls the POST /api/franchise/franchiseID/store endpoint to create a new store
   * @param franchise
   * @param store
   * @returns the new Store
   */
  async createStore(franchise: Franchise, store: Store): Promise<Store> {
    return this.callEndpoint(
      `/api/franchise/${franchise.id}/store`,
      "POST",
      store,
    );
  }

  /**
   * Calls the DELETE /api/franchise/franchiseID/store/storeID endpoint to close a specific store in a franchise
   * @param franchise
   * @param store
   * @returns null
   */
  async closeStore(franchise: Franchise, store: Store): Promise<null> {
    return this.callEndpoint(
      `/api/franchise/${franchise.id}/store/${store.id}`,
      "DELETE",
    );
  }

  /**
   * Calls the GET /api/docs endpoint to show the docs of either the factory or service endpoints
   * @param docType
   * @returns documentation of all the different Endpoint
   */
  async docs(docType: string): Promise<Endpoints> {
    if (docType === "factory") {
      return this.callEndpoint(pizzaFactoryUrl + `/api/docs`);
    }
    return this.callEndpoint(`/api/docs`);
  }

  async updateUser(updatedUser: User): Promise<User> {
    const { user, token } = await this.callEndpoint(
      `/api/user/${updatedUser.id}`,
      "PUT",
      updatedUser,
    );
    localStorage.setItem("token", token);
    return Promise.resolve(user);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.callEndpoint(`/api/user/${userId}`, "DELETE");
    return Promise.resolve();
  }

  async getUsers(
    userPage: number,
    limit: number,
    nameFilter: string,
  ): Promise<{ users: User[]; more: boolean }> {
    const result = await this.callEndpoint(
      `/api/user?userPage=${userPage}&limit=${limit}&name=${nameFilter}`,
    );
    return Promise.resolve(result);
  }
}

const httpPizzaService = new HttpPizzaService();
export default httpPizzaService;
