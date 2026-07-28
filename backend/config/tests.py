from django.test import SimpleTestCase


class RootEndpointTests(SimpleTestCase):
    def test_root_returns_json_payload(self):
        response = self.client.get('/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'ok')
        self.assertEqual(response.json()['service'], 'backend')
