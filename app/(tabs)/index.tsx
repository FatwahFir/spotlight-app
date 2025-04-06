import Loader from '@/components/loader'
import Post from '@/components/post'
import StoriesSection from '@/components/StoriesSection'
import { COLORS } from '@/constants/theme'
import { api } from '@/convex/_generated/api'
import { styles } from '@/styles/feed.style'
import { useAuth } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from 'convex/react'
import React from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'

export default function Index() {
  const { signOut } = useAuth()
  const posts = useQuery(api.posts.getFeedPosts)
  if (posts === undefined) return <Loader />
  if (posts.length === 0) return <NoPostFound />
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>spotlight</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name='log-out-outline' size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection/> }
      />
    </View>
  )
}

const NoPostFound = () => (
  <View
    style={
      {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
)