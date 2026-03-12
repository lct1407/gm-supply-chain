/**
 * MOCK GRAPHQL API CONFIGURATION (FOR FUTURE EXTENSIBILITY)
 * 
 * Đây là cấu trúc giả lập (Mockup Structure) để làm nền tảng mở rộng GraphQL trong tương lai.
 * Trong Phase 2, khi BE sẵn sàng, chúng ta sẽ cài đặt `@apollo/client` hoặc `urql`
 * và thay thế `fetchMockGraphQL` bằng các Hooks thực tế như `useQuery(GET_FARMS)`.
 */

export const MOCK_GRAPHQL_SCHEMA = `
  type Farm {
    id: ID!
    name: String!
    location: String!
    status: FarmStatus!
    temperature: Float!
    humidity: Float!
  }

  enum FarmStatus {
    OPTIMAL
    WARNING
    CRITICAL
  }

  type Batch {
    id: ID!
    type: String!
    farmId: ID!
    stage: String!
    progress: Int!
    expectedHarvestDate: String
  }

  type Query {
    getFarms: [Farm!]!
    getBatches(farmId: ID): [Batch!]!
    getInventory(category: String): [InventoryItem!]!
  }
`;

/**
 * Hàm giả lập gọi GraphQL Client. 
 * Component sử dụng:
 * const data = await fetchMockGraphQL(GET_FARMS_QUERY);
 */
export async function fetchMockGraphQL(query: string, variables = {}) {
  console.log(`[GraphQL Mock] Executing Query:`, query);
  
  // Giả lập network delay 500ms
  await new Promise(resolve => setTimeout(resolve, 500));

  // Trả về dữ liệu mock tương ứng với Query (Tùy chỉnh the schema)
  if (query.includes('getFarms')) {
    return {
      data: {
        getFarms: [
          { id: '1', name: 'Nông Trại Đinh Gia', location: 'Lâm Đồng, VN', status: 'OPTIMAL', temperature: 22, humidity: 85 },
          { id: '2', name: 'Farm Nấm Nhộng', location: 'Củ Chi, HCM', status: 'WARNING', temperature: 26, humidity: 70 },
        ]
      }
    };
  }
  
  return { data: null };
}

// Ví dụ các Queries sẽ dùng trong component tương lai:
export const QUERIES = {
  GET_FARMS: `
    query GetFarms {
      getFarms {
        id
        name
        location
        status
        temperature
        humidity
      }
    }
  `,
  GET_BATCHES: `
    query GetBatches($farmId: ID) {
      getBatches(farmId: $farmId) {
        id
        type
        stage
        progress
      }
    }
  `
};
