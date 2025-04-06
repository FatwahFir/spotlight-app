import { STORIES } from "@/constants/mock-data"
import { styles } from "@/styles/feed.style"
import { ScrollView } from "react-native"
import Story from "./Story"

const StoriesSection = () => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.storiesContainer}
  >
    {STORIES.map((story) => (<Story key={story.id} story={story} />))}
  </ScrollView>
)

export default StoriesSection