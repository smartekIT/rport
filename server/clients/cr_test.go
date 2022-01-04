package clients

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/cloudradar-monitoring/rport/server/api/users"
	"github.com/cloudradar-monitoring/rport/share/query"
)

type UserMock struct {
	ReturnIsAdmin bool
	ReturnGroups  []string
}

func (u UserMock) IsAdmin() bool {
	return u.ReturnIsAdmin
}

func (u UserMock) GetGroups() []string {
	return u.ReturnGroups
}

var admin = UserMock{
	ReturnIsAdmin: true,
}

func TestCRWithExpiration(t *testing.T) {
	now = nowMockF

	exp := 2 * time.Hour
	repo := NewClientRepository([]*Client{c1, c2}, &exp, testLog)

	assert := assert.New(t)
	assert.NoError(repo.Save(c3))
	assert.NoError(repo.Save(c4))

	gotCount, err := repo.Count()
	assert.NoError(err)
	assert.Equal(3, gotCount)

	gotCountActive, err := repo.CountActive()
	assert.NoError(err)
	assert.Equal(1, gotCountActive)

	gotCountDisconnected, err := repo.CountDisconnected()
	assert.NoError(err)
	assert.Equal(2, gotCountDisconnected)

	gotClients, err := repo.GetAll()
	assert.NoError(err)
	assert.ElementsMatch([]*Client{c1, c2, c3}, gotClients)

	// active
	gotClient, err := repo.GetActiveByID(c1.ID)
	assert.NoError(err)
	assert.Equal(c1, gotClient)

	// disconnected
	gotClient, err = repo.GetActiveByID(c2.ID)
	assert.NoError(err)
	assert.Nil(gotClient)

	deleted, err := repo.DeleteObsolete()
	assert.NoError(err)
	require.Len(t, deleted, 1)
	assert.Equal(c4, deleted[0])
	gotClients, err = repo.GetAll()
	assert.NoError(err)
	assert.ElementsMatch([]*Client{c1, c2, c3}, gotClients)

	assert.NoError(repo.Delete(c3))
	gotClients, err = repo.GetAll()
	assert.NoError(err)
	assert.ElementsMatch([]*Client{c1, c2}, gotClients)
}

func TestCRWithNoExpiration(t *testing.T) {
	now = nowMockF

	repo := NewClientRepository([]*Client{c1, c2, c3}, nil, testLog)
	c4Active := shallowCopy(c4)
	c4Active.DisconnectedAt = nil

	assert := assert.New(t)
	assert.NoError(repo.Save(c4Active))

	gotCount, err := repo.Count()
	assert.NoError(err)
	assert.Equal(4, gotCount)

	gotCountActive, err := repo.CountActive()
	assert.NoError(err)
	assert.Equal(2, gotCountActive)

	gotCountDisconnected, err := repo.CountDisconnected()
	assert.NoError(err)
	assert.Equal(2, gotCountDisconnected)

	gotClients, err := repo.GetAll()
	assert.NoError(err)
	assert.ElementsMatch([]*Client{c1, c2, c3, c4Active}, gotClients)

	// active
	gotClient, err := repo.GetActiveByID(c1.ID)
	assert.NoError(err)
	assert.Equal(c1, gotClient)

	// disconnected
	gotClient, err = repo.GetActiveByID(c2.ID)
	assert.NoError(err)
	assert.Nil(gotClient)

	deleted, err := repo.DeleteObsolete()
	assert.NoError(err)
	assert.Len(deleted, 0)

	assert.NoError(repo.Delete(c4Active))
	gotClients, err = repo.GetAll()
	assert.NoError(err)
	assert.ElementsMatch([]*Client{c1, c2, c3}, gotClients)
}

func TestCRWithFilter(t *testing.T) {
	testCases := []struct {
		name              string
		filters           []query.FilterOption
		expectedClientIDs []string
	}{
		{
			name: "single value",
			filters: []query.FilterOption{
				{
					Column: []string{"os_full_name"},
					Values: []string{
						"Alpine Linux",
					},
				},
			},
			expectedClientIDs: []string{
				"2fb5eca74d7bdf5f5b879ebadb446af7c113b076354d74e1882d8101e9f4b918",
			},
		},
		{
			name: "wildcard",
			filters: []query.FilterOption{
				{
					Column: []string{"os_full_name"},
					Values: []string{
						"Alpine*",
					},
				},
			},
			expectedClientIDs: []string{
				"aa1210c7-1899-491e-8e71-564cacaf1df8",
				"2fb5eca74d7bdf5f5b879ebadb446af7c113b076354d74e1882d8101e9f4b918",
			},
		},
		{
			name: "array value",
			filters: []query.FilterOption{
				{
					Column: []string{"ipv4"},
					Values: []string{
						"192.168.122.111",
					},
				},
			},
			expectedClientIDs: []string{
				"aa1210c7-1899-491e-8e71-564cacaf1df8",
			},
		},
		{
			name: "multiple values",
			filters: []query.FilterOption{
				{
					Column: []string{"os_full_name"},
					Values: []string{
						"Alpine*",
						"Microsoft Windows Server 2016 Standard",
					},
				},
			},
			expectedClientIDs: []string{
				"2fb5eca74d7bdf5f5b879ebadb446af7c113b076354d74e1882d8101e9f4b918",
				"aa1210c7-1899-491e-8e71-564cacaf1df8",
				"daflkdfjqlkerlkejrqlwedalfdfadfa",
			},
		},
		{
			name: "multiple filters",
			filters: []query.FilterOption{
				{
					Column: []string{"os_virtualization_system"},
					Values: []string{
						"KVM",
						"Microsoft Windows Server 2016 Standard",
					},
				},
				{
					Column: []string{"os_virtualization_role"},
					Values: []string{
						"guest",
					},
				},
			},
			expectedClientIDs: []string{
				"aa1210c7-1899-491e-8e71-564cacaf1df8",
			},
		},
		{
			name: "or columns",
			filters: []query.FilterOption{
				{
					Column: []string{"os_full_name", "ipv4"},
					Values: []string{
						"Microsoft Windows Server 2016 Standard",
						"192.168.*.111",
					},
				},
			},
			expectedClientIDs: []string{
				"daflkdfjqlkerlkejrqlwedalfdfadfa",
				"aa1210c7-1899-491e-8e71-564cacaf1df8",
			},
		},
		{
			name: "no results",
			filters: []query.FilterOption{
				{
					Column: []string{"os_full_name"},
					Values: []string{
						"Oracle",
					},
				},
			},
			expectedClientIDs: []string{},
		},
		{
			name: "all filters",
			filters: []query.FilterOption{
				{
					Column: []string{"id"},
					Values: []string{
						"a*",
					},
				},
				{
					Column: []string{"name"},
					Values: []string{
						"*Client*",
					},
				},
				{
					Column: []string{"os"},
					Values: []string{
						"Linux*",
					},
				},
				{
					Column: []string{"os_arch"},
					Values: []string{
						"amd64",
					},
				},
				{
					Column: []string{"os_family"},
					Values: []string{
						"alpine",
					},
				},
				{
					Column: []string{"os_kernel"},
					Values: []string{
						"linux",
					},
				},
				{
					Column: []string{"os_full_name"},
					Values: []string{
						"Alpine",
					},
				},
				{
					Column: []string{"os_version"},
					Values: []string{
						"3.14.*",
					},
				},
				{
					Column: []string{"os_virtualization_role"},
					Values: []string{
						"guest",
					},
				},
				{
					Column: []string{"os_virtualization_system"},
					Values: []string{
						"KVM",
					},
				},
				{
					Column: []string{"cpu_family"},
					Values: []string{
						"6",
					},
				},
				{
					Column: []string{"cpu_model"},
					Values: []string{
						"79",
					},
				},
				{
					Column: []string{"cpu_model_name"},
					Values: []string{
						"*KVM*",
					},
				},
				{
					Column: []string{"cpu_vendor"},
					Values: []string{
						"GenuineIntel",
					},
				},
				{
					Column: []string{"num_cpus"},
					Values: []string{
						"2",
					},
				},
				{
					Column: []string{"timezone"},
					Values: []string{
						"CEST*",
					},
				},
				{
					Column: []string{"hostname"},
					Values: []string{
						"alpine-*",
					},
				},
				{
					Column: []string{"ipv4"},
					Values: []string{
						"192.168.*.*",
					},
				},
				{
					Column: []string{"ipv6"},
					Values: []string{
						"fe80::b84f:aff:fe59:a0b1",
					},
				},
				{
					Column: []string{"tags"},
					Values: []string{
						"Datacenter 1",
					},
				},
				{
					Column: []string{"version"},
					Values: []string{
						"0.1.12",
					},
				},
				{
					Column: []string{"address"},
					Values: []string{
						"88.198.189.161:50078",
					},
				},
				{
					Column: []string{"client_auth_id"},
					Values: []string{
						"client-1",
					},
				},
				{
					Column: []string{"allowed_user_groups"},
					Values: []string{
						"Administrators",
					},
				},
			},
			expectedClientIDs: []string{
				"aa1210c7-1899-491e-8e71-564cacaf1df8",
			},
		},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()

			repo := NewClientRepository([]*Client{c1, c2, c5}, nil, testLog)

			actualClients, err := repo.GetUserClients(admin, tc.filters)
			require.NoError(t, err)

			actualClientIDs := make([]string, 0, len(actualClients))

			for _, actualClient := range actualClients {
				actualClientIDs = append(actualClientIDs, actualClient.ID)
			}

			assert.ElementsMatch(t, tc.expectedClientIDs, actualClientIDs)
		})
	}
}

func TestCRWithUnsupportedFilter(t *testing.T) {
	repo := NewClientRepository([]*Client{c1}, nil, testLog)
	_, err := repo.GetUserClients(admin, []query.FilterOption{
		{
			Column: []string{"unknown_field"},
			Values: []string{
				"1",
			},
		},
	})
	require.EqualError(t, err, "unsupported filter column: unknown_field")
}

func TestGetUserClients(t *testing.T) {
	c1 := New(t).Build()                                                             // no groups
	c2 := New(t).AllowedUserGroups([]string{users.Administrators}).Build()           // admin
	c3 := New(t).AllowedUserGroups([]string{users.Administrators, "group1"}).Build() // admin + group1
	c4 := New(t).AllowedUserGroups([]string{"group1"}).Build()                       // group1
	c5 := New(t).AllowedUserGroups([]string{"group1", "group2"}).Build()             // group1 + group2
	c6 := New(t).AllowedUserGroups([]string{"group2"}).Build()                       // group2
	c7 := New(t).AllowedUserGroups([]string{"group3"}).Build()                       // group3
	c8 := New(t).AllowedUserGroups([]string{"group2", "group3"}).Build()             // group2 + group3
	allClients := []*Client{c1, c2, c3, c4, c5, c6, c7, c8}

	repo := NewClientRepository(allClients, nil, testLog)
	testCases := []struct {
		name          string
		user          User
		wantClientIDs []*Client
	}{
		{
			name:          "admin user",
			user:          admin,
			wantClientIDs: allClients,
		},
		{
			name:          "user with no groups has no access",
			user:          &UserMock{ReturnGroups: nil},
			wantClientIDs: []*Client{},
		},
		{
			name:          "user with unknown group",
			user:          &UserMock{ReturnGroups: []string{"unknown"}},
			wantClientIDs: []*Client{},
		},
		{
			name:          "non-admin user with access to few clients",
			user:          &users.User{Groups: []string{"group1", "group2"}},
			wantClientIDs: []*Client{c3, c4, c5, c6, c8},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// when
			gotClients, gotErr := repo.GetUserClients(tc.user, nil)

			// then
			require.NoError(t, gotErr)
			assert.ElementsMatch(t, tc.wantClientIDs, gotClients)
		})
	}
}
